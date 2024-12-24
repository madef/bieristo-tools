<?php
/**
 * getBrassinController.php
 *
 * Contrôleur gérant l'action "get-brassin".
 * Retourne le détail d'un brassin :
 *  - titre
 *  - date_modif
 *  - _id
 *  - history (champ stocké dans le document brassin)
 */

require_once __DIR__ . '/../Services/TokenService.php';
require_once __DIR__ . '/../Services/MongoDBService.php';

use MongoDB\BSON\ObjectId;
use MongoDB\BSON\UTCDateTime;

function getBrassinController(array $data)
{
    // 1. Vérifier la présence du token et du brassin_id
    if (empty($data['token']) || empty($data['brassin_id'])) {
        http_response_code(400);
        echo json_encode([
            'status'  => 'ERROR',
            'message' => 'Token or brassin_id missing'
        ]);
        return;
    }

    $tokenValue  = $data['token'];
    $brassinId   = $data['brassin_id'];

    // 2. Vérifier token => user_id
    $userId = \App\Services\TokenService::checkTokenAndGetUserId($tokenValue);
    if (!$userId) {
        http_response_code(401);
        echo json_encode([
            'status'  => 'ERROR',
            'message' => 'Invalid or expired token'
        ]);
        return;
    }

    // 3. Convertir brassin_id en ObjectId
    try {
        $brassinObjectId = new ObjectId($brassinId);
    } catch (\Exception $e) {
        http_response_code(400);
        echo json_encode([
            'status'  => 'ERROR',
            'message' => 'Invalid brassin_id format'
        ]);
        return;
    }

    // 4. Connexion Mongo
    $mongoDb = MongoDBService::getInstance();
    $brassinCollection = $mongoDb->selectCollection('brassin');

    // 5. Vérifier que ce brassin appartient à l'utilisateur (ownership)
    $brassinDoc = $brassinCollection->findOne([
        '_id'     => $brassinObjectId,
        'user_id' => $userId
    ]);
    if (!$brassinDoc) {
        http_response_code(403);
        echo json_encode([
            'status'  => 'ERROR',
            'message' => 'Brassin not found or not owned by user'
        ]);
        return;
    }

    // 6. Renvoyer les infos demandées : titre, date_modif, _id, history
    // On suppose que 'history' est un champ stocké dans le document brassin.
    $response = [
        'status'       => 'OK',
        'brassin_id'   => (string)$brassinDoc['_id'],
        'titre'        => $brassinDoc['titre'] ?? '',
        'date_modif'   => isset($brassinDoc['date_modif']) && $brassinDoc['date_modif'] instanceof UTCDateTime
                          ? $brassinDoc['date_modif']->toDateTime()->format('Y-m-d H:i:s')
                          : '',
        'history'      => $brassinDoc['history'] ?? null
    ];

    echo json_encode($response);
}

