<?php
/**
 * deleteUserController.php
 *
 * Contrôleur gérant l'action "delete-user".
 * Supprime l'utilisateur associé au token, 
 * ainsi que tous les brassins liés à cet utilisateur.
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
            'message' => 'Token missing in request'
        ]);
        return;
    }

    $tokenValue = $data['token'];

    // 2. Vérifier le token et récupérer l'user_id
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

    // 3. Connexion MongoDB
    $mongoDb = MongoDBService::getInstance();
    $userCollection    = $mongoDb->selectCollection('user');
    $brassinCollection = $mongoDb->selectCollection('brassin');

    // Vérifier que l'user existe (optionnel mais utile pour un code 404)
    $userDoc = $userCollection->findOne(['_id' => $userId]);
    if (!$userDoc) {
        http_response_code(404);
        echo json_encode([
            'status'  => 'ERROR',
            'message' => 'User not found'
        ]);
        return;
    }

    // 4. Supprimer tous les brassins liés à cet user
    $deleteBrassinsResult = $brassinCollection->deleteMany(['user_id' => $userId]);
    $nbrBrassinsSupprimes = $deleteBrassinsResult->getDeletedCount();

    // 5. Supprimer l'utilisateur
    $deleteUserResult = $userCollection->deleteOne(['_id' => $userId]);
    if ($deleteUserResult->getDeletedCount() < 1) {
        // Aucune suppression réalisée ?
        http_response_code(500);
        echo json_encode([
            'status'  => 'ERROR',
            'message' => 'Failed to delete user'
        ]);
        return;
    }

    // 6. Réponse OK
    echo json_encode([
        'status'             => 'OK',
        'message'            => 'User and brassins deleted successfully',
        'user_id'            => (string)$userId,
        'brassins_deleted'   => $nbrBrassinsSupprimes
    ]);
}

