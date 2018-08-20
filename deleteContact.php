<?php

require_once("config.php");
require_once("db.php");  // $link

// ?id=
if( isset($_POST['id']) ) {
    $id = $_POST['id'];
    // echo "delete $id";
    // return;

    if($id == '') {
        $errors[] = ['title' => 'deleteContact: поле id не задано!'];
    }

    if( empty($errors) ) {
        $id = mysqli_real_escape_string($link, $id);
        // "DELETE FROM `contacts` WHERE `contacts`.`id` = 13"
        $query = "DELETE FROM contacts WHERE contacts.id = ".$id;
        
        $result = mysqli_query($link, $query);
        if( !$result ) {
            die(mysqli_error($link));
        }

        echo "success";
    } else {
        echo "error";
    }
}

?>