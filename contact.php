<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['message']);

    $to = "your-email@example.com";  // Փոխարինեք ձեր էլ. փոստի հասցեով
    $subject = "New Message from Website";
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-type: text/plain; charset=UTF-8\r\n";

    $full_message = "Name: $name\nEmail: $email\n\nMessage:\n$message";

    if (mail($to, $subject, $full_message, $headers)) {
        echo "Your message has been sent.";
    } else {
        echo "There was a problem sending your message.";
    }
} else {
    echo "405 Method Not Allowed";
}
?>
