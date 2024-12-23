<?php
/**
 * deleteHistoryController.php
 *
 * Controleur gerant l'action "delete-history".
 */

require_once __DIR__ . '/../Services/TokenService.php';
require_once __DIR__ . '/../Services/MongoDBService.php';

use MongoDB\BSON\ObjectId;

function deleteHistoryController(array $data)
{
    // 1. Verifier la presence du token et de history_id
    if (empty($data['token']) || empty($data['history_id'])) {
        http_response_code(400);
        echo json_encode([
            'status'  => 'ERROR',
            'message' => 'Token or history_id missing in request'
        ]);
        return;
    }
    
    $tokenValue   = $data['token'];
    $historyIdStr = $data['history_id'];

    // 2. Verifier la validite du token et recuperer l'user_id
    $userId = TokenService::checkTokenAndGetUserId($tokenValue);
    if (!$userId) {
        http_response_code(401);
        echo json_encode([
            'status'  => 'ERROR',
            'message' => 'Invalid or expired token'
        ]);
        return;
    }

    // 3. Conversion de history_id en ObjectId
    try {
        $historyObjectId = new ObjectId($historyIdStr);
    } catch (\Exception $e) {
        http_response_code(400);
        echo json_encode([
            'status'  => 'ERROR',
            'message' => 'Invalid history_id format'
        ]);
        return;
    }

    // 4. Connexion a MongoDB
    $mongoDb = MongoDBService::getInstance();
    $historyCollection = $mongoDb->selectCollection('history');
    $brassinCollection = $mongoDb->selectCollection('brassin');

    // 5. Recuperer le document history pour connaitre le brassin_id
    $historyDoc = $historyCollection->findOne(['_id' => $historyObjectId]);
    if (!$historyDoc) {
        // L'entree n'existe pas
        http_response_code(404);
        echo json_encode([
            'status'  => 'ERROR',
            'message' => 'History entry not found'
        ]);
        return;
    }

    // 6. Verifier ownership via brassin_id
    $brassinId = $historyDoc['brassin_id'] ?? null;
    if (!$brassinId) {
        // Pas de brassin_id => doc mal forme ?
        http_response_code(500);
        echo json_encode([
            'status'  => 'ERROR',
            'message' => 'History doc missing brassin_id'
        ]);
        return;
    }

    // Verifier que ce brassin appartient bien au user
    $brassinDoc = $brassinCollection->findOne([
        '_id'     => $brassinId,
        'user_id' => $userId
    ]);
    if (!$brassinDoc) {
        // Soit le brassin n'existe pas, soit il n'appartient pas a l'user
        http_response_code(403);
        echo json_encode([
            'status'  => 'ERROR',
            'message' => 'Brassin not found or not owned by user'
        ]);
        return;
    }

    // 7. Supprimer l'entree history
    $deleteResult = $historyCollection->deleteOne(['_id' => $historyObjectId]);
    if ($deleteResult->getDeletedCount() < 1) {
        // Aucune suppression effectuee ?
        http_response_code(500);
        echo json_encode([
            'status'  => 'ERROR',
            'message' => 'Failed to delete history entry'
        ]);
        return;
    }

    // 8. Reponse de succes
    echo json_encode([
        'status'      => 'OK',
        'message'     => 'History entry deleted successfully',
        'history_id'  => (string)$historyObjectId
    ]);
}

