<?php

	include('../lib/simpleimage/SimpleImage.php');

	function getDBConnection() {
		// Note: Modern PHP engines automatically free connections
		include 'conf/db.php';
		
		$connection = mysqli_connect($dbConfig['db_host'], $dbConfig['db_user'], $dbConfig['db_password']); 
		$success = mysqli_select_db($connection, $dbConfig['db_name']); 
		
		if (!$connection || !$success) {
			throw new Exception("ERROR when connecting to DB " . mysqli_connect_error());
		}
		
		return $connection;
	}
	
	function dbGetQueryResult($sql) {
		$connection = getDBConnection();
		
		$result = mysqli_query($connection, $sql);
		
		if (!$result) {
			throw new Exception("ERROR when doing SQL query " . mysqli_error($connection));
		}
		
		return $result;
	}
	
	function dbReadRow($sql) {
		$result = dbGetQueryResult($sql);

		$row = mysqli_fetch_array($result);

		mysqli_free_result($result);

		return $row;
	}
	
	function dbWrite($sql) {
		dbGetQueryResult($sql);
	}
	
	function dbCountRows($sql) {
		$result = dbGetQueryResult($sql);
		
		return mysqli_num_rows($result);
	}
	
	function dbEscape($str) {
		$connection = getDBConnection();
		return mysqli_real_escape_string($connection, $str);
	}
	
	function getSlideshow($slideshowId) {
		$row = dbReadRow("SELECT src FROM slideshows WHERE id = '" . dbEscape($slideshowId) . "';");
		return reverse_escape($row['src']); // Fjernet denne linjen hos meg (Holger) fordi det blir feil å unescape på min maskin! Merkelig. Kanske forskjell på lokal maskin og server?
		//return $row['src'];
	}
	
	function getImage($imageId) {
		$row = dbReadRow("SELECT bytes FROM images WHERE id = '" . dbEscape($imageId) . "';");
		return $row['bytes'];
	}
	
	function getContentType($imageId) {
		if (preg_match("/\.jpg/i", $imageId) || preg_match("/\.jpeg/i", $imageId)) {
			return "Content-type: image/jpeg";
		} elseif (preg_match("/\.png/i", $imageId)) {
			return "Content-type: image/png";
		} elseif (preg_match("/\.gif/i", $imageId)) {
			return "Content-type: image/gif";
		} else {
			return null;
		}
	}
	
	function isCorrectKey($slideshowId, $slideshowKey) {
		$row = dbReadRow("SELECT admin_key FROM slideshows WHERE id = '" . dbEscape($slideshowId) . "';");
		return $row['admin_key'] == $slideshowKey;
	}
	
	function updateSlideshow($slideshowId, $slideshowToSave) {
		dbWrite("UPDATE slideshows SET src='" . dbEscape($slideshowToSave) . "' WHERE id='" . dbEscape($slideshowId) . "';");
	}
	
	function updateOrInsertImage($imageId, $bytes) {
		$count = dbCountRows("SELECT id FROM images WHERE id='" . dbEscape($imageId) . "';");
		if ($count > 0) {
			dbWrite("UPDATE images SET bytes='" . dbEscape($bytes) . "' WHERE id='" . dbEscape($imageId) . "';");
		} else {
			dbWrite("INSERT INTO images (id, bytes) VALUES ('" . dbEscape($imageId) . "', '" . dbEscape($bytes) . "');");
		}
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
			$id = generateRandomLegibleString();
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
	
	function reverse_escape($str) {
	  $search=array("\\\\","\\0","\\n","\\r","\Z","\'",'\"');
	  $replace=array("\\","\0","\n","\r","\x1a","'",'"');
	  return str_replace($search,$replace,$str);
	}
	
	function generateRandomLegibleString() {
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
		if (isset($_FILES['picturefile']['name'])) {
			$referersplit = preg_split("/[?]/", $_SERVER['HTTP_REFERER']);
			$referer = $referersplit[0];
			try {
				if ($_FILES["picturefile"]["size"] > 5*1024*1024 || $_FILES['picturefile']['tmp_name'] == null) {
					throw new Exception('File too large!');
				} else if (getContentType($_FILES['picturefile']['name']) == null) {
					throw new Exception('File type not supported!');
				} else {
					$filename = generateUniqueId() . "-" . $_FILES['picturefile']['name'];
					$tmpName = $_FILES['picturefile']['tmp_name'];

					$image = new SimpleImage();
					$image->load($tmpName);
					$imageWasResized = false;

					if ($image->getHeight() > 1024) {
						$image->resizeToHeight(1024);
					}

					if ($image->getWidth() > 1024) {
						$image->resizeToWidth(1024);
					}

					$image->save($tmpName); // Saving even if not resized, to reduce compression level of file
					
					$fp = fopen($tmpName, 'r');
					$content = fread($fp, filesize($tmpName));
					fclose($fp);
					
					updateOrInsertImage($filename, $content);
				}

				header('Location: ' . $referer . "?uploadresult=true&filelocation=php/io.php?file=" . $filename);
				return true;
			} catch (Exception $e) {
			    header('Location: ' . $referer . "?uploadresult=false&errormsg=" . $e->getMessage());
				return true;
			}
		}

		if (isset($_GET['id'])) {
			$slideshowId = $_GET['id'];
			$slideshowSrc = getSlideshow($slideshowId);
			$slideshow = array('id' => $slideshowId, 'src' => $slideshowSrc);
			sendJSONResponse(json_encode($slideshow));
			return true;
		}
		 
		if (isset($_POST['id'], $_POST['key'], $_POST['src'])) {
			$slideshowId = $_POST['id'];
			$slideshowKey = $_POST['key'];
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
			$key = generateRandomLegibleString();
			createEmptySlideshow($id, $key);
			$idAndKey = array('id' => $id, 'key' => $key);
			sendJSONResponse(json_encode($idAndKey));
			return true;
		}
		
		if (isset($_GET['file'])) {
			$imageId = $_GET['file'];
			$image = getImage($imageId);
			header("Content-type: " . getContentType($imageId));
			print($image);
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
		throw $e;
	}
?>

<?php if (!$responseWritten): ?>
	<html>
		<head>
			<style type="text/css">
				form {margin: 10px; padding: 10px; border: 1px dotted gray;}
				body {font-family: monospace;}
			</style>
		</head>
		<body>
			<form method="GET">
				<label for="id">id:</label> <input type="text" name="id" id="id"/> <input type="submit" value="Read slideshow"/>
			</form>
		
			<form method="POST">
				<table>
					<tr>
						<td><label for="id">id:</label></td>
						<td><input type="text" name="id" id="id"/></td>
					</tr>
					<tr>
						<td><label for="key">key:</label></td>
						<td><input type="text" name="key" id="key"/></td>
					</tr>
					<tr>
						<td><label for="src">src:</label></td>
						<td><textarea name="src" id="src"></textarea></td>
					</tr>
					<tr>
						<td><input type="submit" value="Update slideshow"/></td>
					</tr>
				</table>
			</form>
			
			<form method="POST">
				<input type="hidden" name="create"/>
				<input type="submit" value="Create empty slideshow"/>
			</form>
		</body>
	</html>
<?php endif ?>