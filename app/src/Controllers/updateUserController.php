<?php
/**
 * updateUserController.php
 *
 * Contrôleur gérant l'action "update-user".
 * Permet de modifier le document user associé au token, 
 * en particulier pour définir/mise à jour le champ "unity".
 */

require_once __DIR__ . '/../Services/MongoDBService.php';
require_once __DIR__ . '/../Services/TokenService.php';

use MongoDB\BSON\UTCDateTime;

function updateUserController(array $data)
{
    // 1. Vérifier la présence du token
    if (empty($data['token'])) {
        http_response_code(400);
        echo json_encode([
            'status'  => 'ERROR',
            'message' => 'Api:UpdateUser:missingToken',
        ]);
        return;
    }
    $tokenValue = $data['token'];

    // 2. Vérifier la validité du token et extraire l'user_id
    $userId = TokenService::checkTokenAndGetUserId($tokenValue);
    if (!$userId) {
        // Token invalide ou expiré
        http_response_code(401);
        echo json_encode([
            'status'  => 'ERROR',
            'message' => 'Api:UpdateUser:invalid',
        ]);
        return;
    }

    // 3. Vérifier la présence du champ "unity"
    //    (on suppose que c'est un champ JSON libre ou une simple valeur)
    if (!array_key_exists('data', $data)) {
        http_response_code(400);
        echo json_encode([
            'status'  => 'ERROR',
            'message' => 'Api:UpdateUser:missingData',
        ]);
        return;
    }
    $data = $data['data'];

    // 4. Connexion à la base et récupération du user
    $mongoDb = MongoDBService::getInstance();
    $userCollection = $mongoDb->selectCollection('user');

    $userDoc = $userCollection->findOne(['encoded_email' => $userId]);
    if (!$userDoc) {
        // L'utilisateur n'existe pas ou a été supprimé
        http_response_code(404);
        echo json_encode([
            'status'  => 'ERROR',
            'message' => 'Api:UpdateUser:unknowUser',
        ]);
        return;
    }

    // 5. Mettre à jour le champ "data"
    //    On peut aussi définir un champ "date_modif" ou "date_update" si on veut tracer.
    $updateResult = $userCollection->updateOne(
        ['encoded_email' => $userId],
        [
            '$set' => [
                'data' => $data,
                'date_modif' => new UTCDateTime() // utile pour tracer les mises à jour
            ]
        ]
    );

    if ($updateResult->getModifiedCount() < 1) {
        // Aucune modification ?
        echo json_encode([
            'status'  => 'ERROR',
            'message' => 'Api:UpdateUser:noChange',
        ]);
        return;
    }

    // 6. Réponse OK
    echo json_encode([
        'status' => 'OK',
        'message' => 'Api:UpdateUser:success',
        'user_id'=> (string) $userId
    ]);
}

