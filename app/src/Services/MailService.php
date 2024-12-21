<?php
// src/Services/MailService.php

function sendmail($email, $subject, $message)
{
    // Implementation minimaliste
    // On peut utiliser mail() si le serveur PHP est configure:
    // mail($email, $subject, $message);
    
    // Ou un shell_exec vers sendmail/postfix si disponible:
    // shell_exec("echo '" . escapeshellarg($message) . "' | mail -s '" . escapeshellarg($subject) . "' " . escapeshellarg($email));
    
    // Pour l'instant, on laisse un mock:
    // file_put_contents('sendmail.log', "Send to: $email\nSubject: $subject\nMessage:\n$message\n\n", FILE_APPEND);
    
    // A adapter selon votre environnement
}

