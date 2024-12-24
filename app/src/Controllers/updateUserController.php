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
            'message' => 'Token missing in request'
        ]);
        return;
    }
    $tokenValue = $data['token'];

    // 2. Vérifier la validité du token et extraire l'user_id
    $userId = \App\Services\TokenService::checkTokenAndGetUserId($tokenValue);
    if (!$userId) {
        // Token invalide ou expiré
        http_response_code(401);
        echo json_encode([
            'status'  => 'ERROR',
            'message' => 'Invalid or expired token'
        ]);
        return;
    }

    // 3. Vérifier la présence du champ "unity"
    //    (on suppose que c'est un champ JSON libre ou une simple valeur)
    if (!array_key_exists('unity', $data)) {
        http_response_code(400);
        echo json_encode([
            'status'  => 'ERROR',
            'message' => 'Missing "unity" field in request'
        ]);
        return;
    }
    $unityValue = $data['unity']; 
    // Par exemple, ça peut être un objet JSON, ex. { "foo": "bar" } 
    // ou un simple string "someUnityValue".

    // 4. Connexion à la base et récupération du user
    $mongoDb = MongoDBService::getInstance();
    $userCollection = $mongoDb->selectCollection('user');

    $userDoc = $userCollection->findOne(['_id' => $userId]);
    if (!$userDoc) {
        // L'utilisateur n'existe pas ou a été supprimé
        http_response_code(404);
        echo json_encode([
            'status'  => 'ERROR',
            'message' => 'User not found'
        ]);
        return;
    }

    // 5. Mettre à jour le champ "unity" 
    //    On peut aussi définir un champ "date_modif" ou "date_update" si on veut tracer.
    $updateResult = $userCollection->updateOne(
        ['_id' => $userId],
        [
            '$set' => [
                'unity'      => $unityValue,
                'date_modif' => new UTCDateTime() // utile pour tracer les mises à jour
            ]
        ]
    );

    if ($updateResult->getModifiedCount() < 1) {
        // Aucune modification ?
        echo json_encode([
            'status'  => 'ERROR',
            'message' => 'No change performed on user document'
        ]);
        return;
    }

    // 6. Réponse OK
    echo json_encode([
        'status' => 'OK',
        'message'=> 'User updated successfully',
        'user_id'=> (string) $userId
    ]);
}

