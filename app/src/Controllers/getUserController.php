<?php
/**
 * getUserController.php
 *
 * Contrôleur gérant l'action "get-user".
 * Retourne :
 *   - Les infos du user (ex. date_creation, encoded_email, etc.)
 *   - La liste de ses brassins (titre, date_modif, _id).
 */

require_once __DIR__ . '/../Services/TokenService.php';
require_once __DIR__ . '/../Services/MongoDBService.php';

use MongoDB\BSON\UTCDateTime;

function getUserController(array $data)
{
    // 1. Vérifier la présence du token
    if (empty($data['token'])) {
        http_response_code(400);
        echo json_encode([
            'status'  => 'ERROR',
            'message' => 'Token missing'
        ]);
        return;
    }
    $tokenValue = $data['token'];

    // 2. Récupérer l'user_id via le TokenService
    $userId = \App\Services\TokenService::checkTokenAndGetUserId($tokenValue);
    if (!$userId) {
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

    // 4. Récupérer les infos du user
    $userDoc = $userCollection->findOne(['_id' => $userId]);
    if (!$userDoc) {
        http_response_code(404);
        echo json_encode([
            'status'  => 'ERROR',
            'message' => 'User not found'
        ]);
        return;
    }

    // 5. Récupérer tous les brassins de ce user
    $cursor = $brassinCollection->find(
        ['user_id' => $userId],
        ['sort' => ['date_modif' => -1]]  // trie par date_modif décroissant (si souhaité)
    );

    $brassins = [];
    foreach ($cursor as $doc) {
        $brassins[] = [
            'brassin_id' => (string) $doc['_id'],
            'titre'      => $doc['titre'] ?? '',
            'date_modif' => isset($doc['date_modif']) && $doc['date_modif'] instanceof UTCDateTime
                ? $doc['date_modif']->toDateTime()->format('Y-m-d H:i:s')
                : ''
        ];
    }

    // 6. Construire la réponse
    // Vous pouvez extraire certains champs utiles depuis userDoc (ex. encoded_email, unity, date_creation)
    $response = [
        'status' => 'OK',
        'user'   => [
            'user_id'        => (string)$userDoc['_id'],
            'encoded_email'  => $userDoc['encoded_email'] ?? '',
            'date_creation'  => (isset($userDoc['date_creation']) && $userDoc['date_creation'] instanceof UTCDateTime)
                                ? $userDoc['date_creation']->toDateTime()->format('Y-m-d H:i:s')
                                : '',
            'unity'          => $userDoc['unity'] ?? null   // si vous avez un champ unity
        ],
        'brassins' => $brassins
    ];

    echo json_encode($response);
}

