<?php
// public/index.php

require __DIR__ . '/../vendor/autoload.php';
header('Content-Type: application/json');
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true) ?? [];

if (!isset($data['action'])) {
    echo json_encode(['error' => 'No action provided']);
    exit;
}

$action = $data['action'];

switch ($action) {
    case 'ask-token':
        require_once __DIR__ . '/../src/Controllers/askTokenController.php';
        askTokenController($data);
        break;
    case 'check-token':
        require_once __DIR__ . '/../src/Controllers/checkTokenController.php';
        checkTokenController($data);
        break;
    case 'renew-token':
        require_once __DIR__ . '/../src/Controllers/renewTokenController.php';
        renewTokenController($data);
        break;
    case 'get-user':
        require_once __DIR__ . '/../src/Controllers/getUserController.php';
        getUserController($data);
        break;
    case 'update-user':
        require_once __DIR__ . '/../src/Controllers/updateUserController.php';
        updateUserController($data);
        break;
    case 'delete-user':
        require_once __DIR__ . '/../src/Controllers/deleteUserController.php';
        deleteUserController($data);
        break;
    default:
        echo json_encode(['error' => "Unknown action: $action"]);
        break;
}

