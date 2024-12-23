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

    // 4. Vérifier les données à mettre à jour (ici, on met à jour le "titre")
    //    On peut aussi accepter d'autres champs (date_debut, etc.) selon vos besoins
    if (!isset($data['titre'])) {
        http_response_code(400);
        echo json_encode([
            'status'  => 'ERROR',
            'message' => 'No update fields provided (titre missing)'
        ]);
        return;
    }
    $nouveauTitre = $data['titre'];

    // 5. Connexion MongoDB
    $mongoDb = MongoDBService::getInstance();
    $brassinCollection = $mongoDb->selectCollection('brassin');

    // 6. Vérifier que le brassin appartient bien à cet user
    //    En général, on fait un findOne({ _id: brassinObjectId, user_id: userId })
    //    Si pas trouvé => pas le droit de modifier
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

    // 7. Mettre à jour le document
    $updateResult = $brassinCollection->updateOne(
        ['_id' => $brassinObjectId],
        [
            '$set' => [
                'titre'          => $nouveauTitre,
                // Optionnel : stocker la date de dernière modif
                'date_modif'     => new UTCDateTime(),
            ]
        ]
    );

    if ($updateResult->getModifiedCount() < 1) {
        // Aucune modification effectuée ?
        echo json_encode([
            'status'  => 'ERROR',
            'message' => 'No changes (maybe titre is identical?)'
        ]);
        return;
    }

    // 8. Réponse de succès
    echo json_encode([
        'status' => 'OK',
        'message'=> 'Brassin updated successfully',
        'brassin_id' => (string)$brassinObjectId
    ]);
}

