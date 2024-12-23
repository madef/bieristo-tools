<?php
// src/Services/MailService.php

function sendmail($email, $subject, $message)
{
    $mail = new \Snipworks\Smtp\Email(SMTP_HOST, SMTP_PORT);
    $mail->setProtocol(SMTP_PROTOCOL);
    $mail->setLogin(SMTP_USERNAME, SMTP_PASSWORD);
    $mail->setFrom(SMTP_SENDER_EMAIL, SMTP_SENDER_LABEL);
    $mail->addTo($email, '');
    $mail->setSubject($subject);
    $mail->setHtmlMessage($message);

    if (!$mail->send()) {
        throw new \Exception('Email cannot be sent');
    }
}

