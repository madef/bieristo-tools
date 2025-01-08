<?php
/**
 * getUserController.php
 *
 * Contrôleur gérant l'action "get-user".
 * Retourne :
 *   - Les infos du user (ex. date_creation, encoded_email, etc.)
 *   - La liste de ses brassins (titre, date_modif, _id).
 */

require_once __DIR__ . '/../Services/TokenService.php';
require_once __DIR__ . '/../Services/MongoDBService.php';

use MongoDB\BSON\UTCDateTime;

function getUserController(array $data)
{
    // 1. Vérifier la présence du token
    if (empty($data['token'])) {
        http_response_code(400);
        echo json_encode([
            'status'  => 'ERROR',
            'message' => 'Api:GetUser:missingToken',
        ]);
        return;
    }
    $tokenValue = $data['token'];

    // 2. Récupérer l'user_id via le TokenService
    $userId = TokenService::checkTokenAndGetUserId($tokenValue);
    if (!$userId) {
        http_response_code(401);
        echo json_encode([
            'status'  => 'ERROR',
            'message' => 'Api:GetUser:invalidToken',
        ]);
        return;
    }

    // 3. Connexion MongoDB
    $mongoDb = MongoDBService::getInstance();
    $userCollection    = $mongoDb->selectCollection('user');
    $brassinCollection = $mongoDb->selectCollection('brassin');

    // 4. Récupérer les infos du user
    $userDoc = $userCollection->findOne(['encoded_email' => $userId]);
    if (!$userDoc) {
        http_response_code(404);
        echo json_encode([
            'status'  => 'ERROR',
            'message' => 'Api:GetUser:unknowUser',
        ]);
        return;
    }

    // 6. Construire la réponse
    $response = [
        'status' => 'OK',
        'data' => $userDoc['data'] ?? (object) []
    ];

    echo json_encode($response);
}

