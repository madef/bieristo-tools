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
    case 'create-brassin':
        require_once __DIR__ . '/../src/Controllers/createBrassinController.php';
        createBrassinController($data);
        break;
    case 'get-brassin-collection':
        require_once __DIR__ . '/../src/Controllers/getBrassinCollectionController.php';
        getBrassinCollectionController($data);
        break;
    case 'update-brassin':
        require_once __DIR__ . '/../src/Controllers/updateBrassinController.php';
        updateBrassinController($data);
        break;
    case 'add-history':
        require_once __DIR__ . '/../src/Controllers/addHistoryController.php';
        addHistoryController($data);
        break;
    case 'delete-history':
        require_once __DIR__ . '/../src/Controllers/deleteHistoryController.php';
        deleteHistoryController($data);
        break;
    default:
        echo json_encode(['error' => "Unknown action: $action"]);
        break;
}

