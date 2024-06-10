<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];

    $to = "your-email@example.com";
    $subject = "New Message from Website";
    $headers = "From: $email";

    mail($to, $subject, $message, $headers);
    echo "Your message has been sent.";
}
?>