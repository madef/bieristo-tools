<?php
// src/Services/EmailHashService.php

require_once __DIR__ . '/../../config/app_config.php';

function encodeEmail($email)
{
    // Ex. usage de hash_hmac avec sha256
    return hash_hmac('sha256', $email, APP_SALT);
}

