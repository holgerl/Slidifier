<?php
	$url=parse_url(getenv("CLEARDB_DATABASE_URL"));

	$server = $url["host"];
	$username = $url["user"];
	$password = $url["pass"];
	$db = substr($url["path"],1);

	$dbConfig = array(
	    'db_host' => $server,
	    'db_name' => $db,
	    'db_user' => $username,
	    'db_password' => $password
	);
?>
