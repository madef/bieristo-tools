<?php
/**
 * deleteBrassinController.php
 *
 * Contrôleur gérant l'action "delete-brassin".
 */

require_once __DIR__ . '/../Services/TokenService.php';
require_once __DIR__ . '/../Services/MongoDBService.php';

use MongoDB\BSON\ObjectId;

function deleteBrassinController(array $data)
{
    // 1. Vérifier la présence du token et du brassin_id
    if (empty($data['token']) || empty($data['brassin_id'])) {
        http_response_code(400);
        echo json_encode([
            'status'  => 'ERROR',
            'message' => 'Token or brassin_id missing in request'
        ]);
        return;
    }

    $tokenValue = $data['token'];
    $brassinId  = $data['brassin_id'];

    // 2. Vérifier la validité du token => récupère l'user_id
    $userId = \App\Services\TokenService::checkTokenAndGetUserId($tokenValue);
    if (!$userId) {
        http_response_code(401);
        echo json_encode([
            'status'  => 'ERROR',
            'message' => 'Invalid or expired token'
        ]);
        return;
    }

    // 3. Conversion du brassin_id en ObjectId
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

    // 4. Connexion à MongoDB
    $mongoDb = MongoDBService::getInstance();
    $brassinCollection = $mongoDb->selectCollection('brassin');

    // 5. Vérifier l’existence et l’ownership du brassin
    //    On cherche un brassin qui correspond à (_id: brassinObjectId, user_id: userId).
    $brassinDoc = $brassinCollection->findOne([
        '_id'     => $brassinObjectId,
        'user_id' => $userId
    ]);
    if (!$brassinDoc) {
        // Le brassin n’existe pas ou n’appartient pas à l’utilisateur
        http_response_code(403);
        echo json_encode([
            'status'  => 'ERROR',
            'message' => 'Brassin not found or not owned by user'
        ]);
        return;
    }

    // 6. Supprimer le brassin
    $deleteResult = $brassinCollection->deleteOne([
        '_id' => $brassinObjectId
    ]);

    if ($deleteResult->getDeletedCount() < 1) {
        http_response_code(500);
        echo json_encode([
            'status'  => 'ERROR',
            'message' => 'Failed to delete brassin'
        ]);
        return;
    }

    // 7. Réponse OK
    echo json_encode([
        'status'     => 'OK',
        'message'    => 'Brassin deleted successfully',
        'brassin_id' => (string)$brassinObjectId
    ]);
}

