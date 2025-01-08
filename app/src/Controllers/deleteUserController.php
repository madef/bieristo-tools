<?php
/**
 * deleteUserController.php
 *
 * Contrôleur gérant l'action "delete-user".
 * Supprime l'utilisateur associé au token.
 */

require_once __DIR__ . '/../Services/TokenService.php';
require_once __DIR__ . '/../Services/MongoDBService.php';

function deleteUserController(array $data)
{
    // 1. Vérifier la présence du token
    if (empty($data['token'])) {
        http_response_code(400);
        echo json_encode([
            'status'  => 'ERROR',
            'message' => 'Api:DeleteUser:missingToken',
        ]);
        return;
    }

    $tokenValue = $data['token'];

    // 2. Vérifier le token et récupérer l'user_id
    $userId = TokenService::checkTokenAndGetUserId($tokenValue);
    if (!$userId) {
        // Token invalide ou expiré
        http_response_code(401);
        echo json_encode([
            'status'  => 'ERROR',
            'message' => 'Api:DeleteUser:invalidToken',
        ]);
        return;
    }

    // 3. Connexion MongoDB
    $mongoDb = MongoDBService::getInstance();
    $userCollection    = $mongoDb->selectCollection('user');

    // Vérifier que l'user existe (optionnel mais utile pour un code 404)
    $userDoc = $userCollection->findOne(['encoded_email' => $userId]);
    if (!$userDoc) {
        http_response_code(404);
        echo json_encode([
            'status'  => 'ERROR',
            'message' => 'Api:DeleteUser:unknowUser',
        ]);
        return;
    }

    // 4. Supprimer l'utilisateur
    $deleteUserResult = $userCollection->deleteOne(['encoded_email' => $userId]);
    if ($deleteUserResult->getDeletedCount() < 1) {
        // Aucune suppression réalisée ?
        http_response_code(500);
        echo json_encode([
            'status'  => 'ERROR',
            'message' => 'Api:DeleteUser:failed',
        ]);
        return;
    }

    // 5. Réponse OK
    echo json_encode([
        'status'             => 'OK',
        'message'            => 'Api:DeleteUser:success',
    ]);
}

