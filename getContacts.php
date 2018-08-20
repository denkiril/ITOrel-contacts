<?php

require_once("config.php");
require_once("db.php");  // $link

$query = "SELECT * FROM contacts ORDER BY name";
$result = mysqli_query($link, $query);
if(!$result){
	die(mysqli_error($link));
}

$numRows = mysqli_num_rows($result);

$contacts = array();

for ($i = 0; $i < $numRows; $i++){
	$row = mysqli_fetch_assoc($result);
	$contacts[] = $row;
}

echo json_encode($contacts);

// $str = json_encode(print_r ($contacts, true));
// echo "<script> console.log('$str'); </script>"

?>