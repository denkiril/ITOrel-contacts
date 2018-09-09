<?php

require_once("config.php");
require_once("db.php");  // $link

$query = "SELECT COUNT(*) FROM contacts";
$result = mysqli_query($link, $query);
if(!$result){
	die(mysqli_error($link));
}

// $numRows = mysqli_num_rows($result); = 1
// $row = mysqli_fetch_assoc($result);
// $row = mysqli_fetch_array($result);
$row = mysqli_fetch_row($result);

// echo json_encode($result);
// echo $row["COUNT(*)"];
echo $row[0];

?>