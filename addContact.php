<?php

require_once("config.php");
require_once("db.php");  // $link

// ?name=&phone=&email=
// echo print_r($_POST);

if( isset($_POST['name'], $_POST['phone'], $_POST['email']) ) {
    // $text = $_POST['name'];
    $name = $_POST['name'];
    $phone = $_POST['phone'];
    $email = $_POST['email'];
    // echo "$name $phone $email";
    // return;

    if($name == '' || $phone == '' || $email == '') {
        $errors[] = ['title' => 'Должны быть заполнены все поля!'];
    }

    if( empty($errors) ) {
        $name = mysqli_real_escape_string($link, $name);
        $phone = mysqli_real_escape_string($link, $phone);
        $email = mysqli_real_escape_string($link, $email);
        //INSERT INTO `contacts` (`id`, `name`, `phone`, `email`) VALUES (NULL, 'name_str', 'phone_str', 'email_str');
        $query = "INSERT INTO contacts (name, phone, email) VALUES ('" . $name . "', '" . $phone . "', '" . $email . "')";
        $result = mysqli_query($link, $query);
        if( !$result ) {
            // $errors[] = ['title' => 'Ошибка записи в БД', 'desc' = mysqli_error($link)];
            die(mysqli_error($link));
        }

        echo "success";
    } else {
        echo "error";
    }
}

?>