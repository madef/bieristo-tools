<?php
/**
 * updateBrassinController.php
 *
 * Contrôleur gérant l'action "update-brassin".
 */

require_once __DIR__ . '/../Services/MongoDBService.php';
require_once __DIR__ . '/../Services/TokenService.php';

use MongoDB\BSON\ObjectId;
use MongoDB\BSON\UTCDateTime;

function updateBrassinController(array $data)
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

    // 2. Vérifier le token
    $userId = TokenService::checkTokenAndGetUserId($tokenValue);
    if (!$userId) {
        // Token invalide ou expiré
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

    // 4. Vérifier au moins la présence du champ "titre"
    //    (Si vous souhaitez le rendre facultatif, adaptez la logique)
    if (!isset($data['titre'])) {
        http_response_code(400);
        echo json_encode([
            'status'  => 'ERROR',
            'message' => 'Missing titre in request'
        ]);
        return;
    }
    $nouveauTitre = $data['titre'];

    // 5. Récupérer l'objet "history" s'il est fourni
    //    Le champ "history" est un objet ou un tableau JSON,
    //    tel que transmis dans la requête.
    $nouvelleHistory = $data['history'] ?? null;
    // Ex.:
    // "history": {
    //    "etape": 1,
    //    "description": "Ajout du houblon"
    // }

    // 6. Connexion Mongo
    $mongoDb = MongoDBService::getInstance();
    $brassinCollection = $mongoDb->selectCollection('brassin');

    // 7. Vérifier l'ownership du brassin
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

    // 8. Préparer le tableau des champs à mettre à jour
    //    - "titre"
    //    - "date_modif" (optionnel)
    //    - "history" (si fourni)
    $updateFields = [
        'titre'      => $nouveauTitre,
        'date_modif' => new UTCDateTime(), // utile pour tracer la modif
    ];

    if ($nouvelleHistory !== null) {
        // On stocke directement l'historique dans le document
        $updateFields['history'] = $nouvelleHistory;
    }

    // 9. Mettre à jour
    $updateResult = $brassinCollection->updateOne(
        ['_id' => $brassinObjectId],
        ['$set' => $updateFields]
    );

    if ($updateResult->getModifiedCount() < 1) {
        // Aucune modification effectuée ?
        echo json_encode([
            'status'  => 'ERROR',
            'message' => 'No change performed'
        ]);
        return;
    }

    // 10. Réponse OK
    echo json_encode([
        'status'     => 'OK',
        'message'    => 'Brassin updated successfully',
        'brassin_id' => (string)$brassinObjectId
    ]);
}

