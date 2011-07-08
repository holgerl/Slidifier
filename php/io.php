<?php 

	function getDBConnection() {
		// Note: Modern PHP engines automatically free connections
		
		$connection = mysql_connect("localhost", "root", ""); 
		$success = mysql_select_db("slidifier", $connection); 
		
		if (!$connection || !$success) {
			throw new Exception("ERROR when connecting to DB");
		}
		
		return $connection;
	}
	
	function dbGetQueryResult($sql) {
		getDBConnection();
		
		$result = mysql_query($sql);
		
		if (!$result) {
			throw new Exception("ERROR when doing SQL query");
		}
		
		return $result;
	}
	
	function dbReadRow($sql) {
		$result = dbGetQueryResult($sql);
		
		$row = mysql_fetch_array($result);
		
		mysql_free_result($result);
		
		return $row;
	}
	
	function dbWrite($sql) {
		dbGetQueryResult($sql);
	}
	
	function dbCountRows($sql) {
		$result = dbGetQueryResult($sql);
		
		return mysql_num_rows($result);
	}
	
	function dbEscape($str) {
		getDBConnection();
		return mysql_real_escape_string($str);
	}
	
	function getSlideshow($slideshowId) {
		$row = dbReadRow("SELECT src FROM slideshows WHERE id = '" . dbEscape($slideshowId) . "';");
		
		return $row['src'];
	}
	
	function isCorrectKey($slideshowId, $slideshowKey) {
		$row = dbReadRow("SELECT admin_key FROM slideshows WHERE id = '" . dbEscape($slideshowId) . "';");
		
		return $row['admin_key'] == $slideshowKey;
	}
	
	function updateSlideshow($slideshowId, $slideshowToSave) {
		dbWrite("UPDATE slideshows SET src='" . dbEscape($slideshowToSave) . "' WHERE id='" . dbEscape($slideshowId) . "';");
	}
	
	function createEmptySlideshow($slideshowId, $slideshowKey) {
		dbWrite("INSERT INTO slideshows (id, admin_key, src) VALUES ('" . dbEscape($slideshowId) . "', '" . dbEscape($slideshowKey) . "', '');");
	}
	
	function doesIdExist($slideshowId) {
		$count = dbCountRows("SELECT id FROM slideshows WHERE id='" . dbEscape($slideshowId) . "';");
		
		return $count > 0;
	}
	
	function generateUniqueId() {
		$isUnique = false;
		
		$id;
		do {
			$id = generateRandomString();
		} while (doesIdExist($id));
		
		return $id;
	}
	
	function removeTheseFromThis($removeThese, $fromThis) {
		for ($i=0; $i < strlen($removeThese); $i++) {
			$removeThis = $removeThese[$i];
			$fromThis = str_replace($removeThis, "", $fromThis);
		}
		
		return $fromThis;
	}
	
	function generateRandomString() {
		
		// alphabet of 51 characters makes 10 character strings at least 56 bits:
		$length = 10;
		$fullAlphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		$similarCharacters = "b6lI1oO0rnm";
		$alphabet = removeTheseFromThis($similarCharacters, $fullAlphabet);
		
		$randomString;
		
		while ($length-- > 0) {
			$randomIndex = mt_rand(0, strlen($alphabet)-1);
			$randomString[$length] = $alphabet[$randomIndex];
		}
		
		return join($randomString);
	}
	
	function sendJSONResponse($json) {
		header("Content-type: application/json");
		print($json);
	}

	function main() {
		
		if (isset($_GET['id'])) {
			$slideshowId = $_GET['id'];
			$slideshowSrc = getSlideshow($slideshowId);
			$slideshow = array('id' => $slideshowId, 'src' => $slideshowSrc);
			sendJSONResponse(json_encode($slideshow));
			return true;
		}
		 
		if (isset($_POST['id'], $_POST['admin_key'], $_POST['src'])) {
			$slideshowId = $_POST['id'];
			$slideshowKey = $_POST['admin_key'];
			$slideshowToSave = $_POST['src'];
			if (isCorrectKey($slideshowId, $slideshowKey)) {
				updateSlideshow($slideshowId, $slideshowToSave);
			} else {
				throw new Exception("ERROR key is wrong");
			}
			$result = array('id' => $slideshowId);
			sendJSONResponse(json_encode($result));
			return true;
		}
		
		if (isset($_POST['create']))  {
			$id = generateUniqueId();
			$key = generateRandomString();
			createEmptySlideshow($id, $key);
			$idAndKey = array('id' => $id, 'admin_key' => $key);
			sendJSONResponse(json_encode($idAndKey));
			return true;
		}
		
		return false;
	}
	
	$responseWritten = false;
	
	try {
		$responseWritten = main();
	} catch (Exception $e) {
		$errorInfo = array('error' => 'error', 'message' => $e->getMessage());
	    sendJSONResponse(json_encode($errorInfo));
	    $responseWritten = true;
	}
?>

<?php if (!$responseWritten): ?>
	<html>
		<body>
			<form method="POST">
				<table>
					<tr>
						<td><label for="id">id:</label></td>
						<td><input type="text" name="id" id="id"/></td>
					</tr>
					<tr>
						<td><label for="admin_key">admin_key:</label></td>
						<td><input type="text" name="admin_key" id="admin_key"/></td>
					</tr>
					<tr>
						<td><label for="src">src:</label></td>
						<td><textarea name="src" id="src"></textarea></td>
					</tr>
					<tr>
						<td><input type="submit" value="Update slideshow"/></td>
					</tr>
				<table>
			</form>
			
			<form method="POST">
				<input type="hidden" name="create"/>
				<input type="submit" value="Create empty slideshow"/>
			</form>
		</body>
	</html>
<?php endif ?>