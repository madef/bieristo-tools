<?php
/**
 * addHistoryController.php
 *
 * Contrôleur gérant l'action "add-history".
 */

require_once __DIR__ . '/../Services/TokenService.php';
require_once __DIR__ . '/../Services/MongoDBService.php';

use MongoDB\BSON\ObjectId;
use MongoDB\BSON\UTCDateTime;

function addHistoryController(array $data)
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
    
    $tokenValue  = $data['token'];
    $brassinId   = $data['brassin_id'];

    // 2. Vérifier le token et extraire le doc
    $tokenDoc = \App\Services\TokenService::getTokenDoc($tokenValue);
    if (!$tokenDoc) {
        http_response_code(401);
        echo json_encode([
            'status'  => 'ERROR',
            'message' => 'Invalid or expired token'
        ]);
        return;
    }

    // Extraire l'user_id du token
    $userId = $tokenDoc['user_id'] ?? null;
    if (!$userId) {
        http_response_code(401);
        echo json_encode([
            'status'  => 'ERROR',
            'message' => 'No user_id associated with token'
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

    // 4. Se connecter à la base, vérifier que le brassin appartient bien au user
    $mongoDb = MongoDBService::getInstance();
    $brassinCollection = $mongoDb->selectCollection('brassin');
    $historyCollection = $mongoDb->selectCollection('history');

    // Vérifier ownership : brassin { _id, user_id }
    $brassinDoc = $brassinCollection->findOne([
        '_id'     => $brassinObjectId,
        'user_id' => $userId
    ]);
    if (!$brassinDoc) {
        // Le brassin n'existe pas ou n'appartient pas à l'user
        http_response_code(403);
        echo json_encode([
            'status'  => 'ERROR',
            'message' => 'Brassin not found or not owned by user'
        ]);
        return;
    }

    // 5. Construire le document d'historique à insérer.
    //    La structure est flexible : on peut récupérer des champs personnalisés 
    //    depuis $data['history_data'], par exemple.
    //    Vous pouvez définir votre propre structure selon vos besoins.
    $historyData = $data['history_data'] ?? []; 
    // (ou tout autre champ selon la forme JSON que vous décidez)

    // On insère :
    //  - brassin_id: lien vers le brassin
    //  - date_creation: date d'insertion
    //  - un contenu flexible (historyData)
    $docToInsert = [
        'brassin_id'    => $brassinObjectId,
        'date_creation' => new UTCDateTime(),
    ];

    // On intègre tout le contenu flexible
    // par exemple, on le stocke dans un champ "payload"
    $docToInsert['payload'] = $historyData;

    $insertResult = $historyCollection->insertOne($docToInsert);

    $historyId = (string)$insertResult->getInsertedId();

    // 6. Réponse OK
    echo json_encode([
        'status'     => 'OK',
        'message'    => 'History item added successfully',
        'history_id' => $historyId
    ]);
}

