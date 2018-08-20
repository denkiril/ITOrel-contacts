<?php

require_once("config.php");
require_once("db.php");  // $link

// ?name=&phone=&email=$id=

if( isset($_POST['name'], $_POST['phone'], $_POST['email'], $_POST['id']) ) {
    $name = $_POST['name'];
    $phone = $_POST['phone'];
    $email = $_POST['email'];
    $id = $_POST['id'];
    // echo "edit $name $phone $email $id";
    // return;

    if($name == '' || $phone == '' || $email == '' || $id == '') {
        $errors[] = ['title' => 'Должны быть заполнены все поля!'];
    }

    if( empty($errors) ) {
        $name = mysqli_real_escape_string($link, $name);
        $phone = mysqli_real_escape_string($link, $phone);
        $email = mysqli_real_escape_string($link, $email);
        $id = mysqli_real_escape_string($link, $id);
        // UPDATE `contacts` SET `name` = 'name_e', `phone` = 'phone_e', `email` = 'email_e' WHERE `contacts`.`id` = 11
        $query = "UPDATE contacts SET name = '".$name."', phone = '".$phone."', email = '".$email."' WHERE contacts.id = ".$id;
        
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