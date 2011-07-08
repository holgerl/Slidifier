<?php 

	function connectToDB() {
		$connection = mysql_connect("localhost", "root", ""); 
		
		$success = mysql_select_db("slidifier", $connection); 
		
		if (!$success) {
			print("ERROR on DB connection");
		}
		
		return $connection;
	}
	
	function disconnectFromDB($connection) {
		mysql_close($connection);
	}
	
	function getSlideshowsForFacebookId($facebookId) {
		$connection = connectToDB();
		
		$result = mysql_query("SELECT src FROM facebook_id_slideshows, slideshows WHERE facebook_id_slideshows.facebook_id = '" . mysql_real_escape_string($facebookId) . "' AND facebook_id_slideshows.slideshow_id = slideshows.id;");
		
		if (!$result) {
			print("ERROR on SQL query");
		}
		
		$slideshows = array();
		
		while($row = mysql_fetch_array($result)) {
			array_push($slideshows, $row['src']);
		}
		
		mysql_free_result($result);
		
		disconnectFromDB($connection);
		
		return $slideshows;
	}
	
	function getSlideshow($slideshowId) {
		$connection = connectToDB();
		
		$result = mysql_query("SELECT src FROM slideshows WHERE id = '" . mysql_real_escape_string($slideshowId) . "';");
		
		if (!$result) {
			print("ERROR on SQL query");
		}
		
		$row = mysql_fetch_array($result);
		
		$slideshow = $row['src'];
		
		mysql_free_result($result);
		
		disconnectFromDB($connection);
		
		return $slideshow;
	}
	
	function isCorrectKey($slideshowId, $slideshowKey) {
		$connection = connectToDB();
		
		$result = mysql_query("SELECT admin_key FROM slideshows WHERE id = '" . mysql_real_escape_string($slideshowId) . "';");
		
		if (!$result) {
			print("ERROR on SQL query");
		}
		
		$row = mysql_fetch_array($result);
		
		$key = $row['slide_key'];
		
		mysql_free_result($result);
		
		disconnectFromDB($connection);
		
		return $key == $slideshowKey;
	}
	
	function getQueryElements() {
		$escapedPath = htmlspecialchars($_SERVER['REQUEST_URI']);
		
		$queryElements = array();
		
		if (!(strpos($escapedPath, "?") === false)) {
			$split = preg_split("/\?/", $escapedPath);
			$queryPart = $split[1];
			
			if (!(strpos($escapedPath, "+") === false)) {
				$queryElements = preg_split("/\+/", $queryPart);
			} else {
				$queryElements = array($queryPart);
			}
		}
		
		$cleanedQueryElements = array();
		
		foreach($queryElements as $value) {
			if(strlen(trim($value)) > 0) {
				array_push($cleanedQueryElements, $value);
			}
		}
		
		return $cleanedQueryElements;
	}
	
	function updateSlideshow($slideshowId, $slideshowToSave) {
		$connection = connectToDB();
		
		$result = mysql_query("UPDATE slideshows SET src='" . mysql_real_escape_string($slideshowToSave) . "' WHERE id='" . mysql_real_escape_string($slideshowId) . "';");
		
		if (!$result) {
			print("ERROR on SQL query");
		}
		
		mysql_free_result($result);
		
		disconnectFromDB($connection);
	}
	
	function createEmptySlideshow($slideshowId, $slideshowKey) {
		$connection = connectToDB();
		
		$result = mysql_query("INSERT INTO slideshows (id, admin_key, src) VALUES ('" . $slideshowId . "', '" . $slideshowKey . "', '');");
		
		if (!$result) {
			print("ERROR on SQL query");
		}
		
		disconnectFromDB($connection);
	}
	
	function doesIdExist($slideshowId) {
		$connection = connectToDB();
		
		$result = mysql_query("SELECT id FROM slideshows WHERE id='" . mysql_real_escape_string($slideshowId) . "';");
		
		if (!$result) {
			print("ERROR on SQL query");
		}
		
		$row = mysql_fetch_array($result);
		
		mysql_free_result($result);
		
		disconnectFromDB($connection);
		
		return !($row === false);
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

	function main() {
		$queryElements = getQueryElements();
		
		if (count($queryElements) > 0) {
			$slideshowId = $queryElements[0];
			$slideshow = array('id' => $slideshowId, 'src' => getSlideshow($slideshowId));
			print(json_encode($slideshow));
			return true;
		}
		 
		if (isset($_POST['id'], $_POST['admin_key'], $_POST['src'])) {
			$slideshowId = $_POST['id'];
			$slideshowKey = $_POST['admin_key'];
			$slideshowToSave = $_POST['src'];
			if (isCorrectKey($slideshowId, $slideshowKey)) {
				updateSlideshow($slideshowId, $slideshowToSave);
			}
		}
		
		if (isset($_POST['create']))  {
			$id = generateUniqueId();
			$key = generateRandomString();
			createEmptySlideshow($id, $key);
			$idAndKey = array('id' => $id, 'admin_key' => $key);
			print(json_encode($idAndKey));
			return true;
		}
		
		return false;
	}
	
	$responseWritten = main();
	
	// TODO: Remove duplicated code for every sql query execution.
?>

<?php if (!$responseWritten): ?>
	<form method="POST">
		id: <input type="text" name="id"/>
		<br/>
		key: <input type="text" name="admin_key"/>
		<br/>
		slideshow: <textarea name="src"></textarea>
		<br/>
		<input type="submit" value="Update slideshow"/>
	</form>
	<br/>
	<form method="POST">
		<input type="hidden" name="create"/>
		<input type="submit" value="Create empty slideshow"/>
	</form>
<?php endif ?>