<?php
/**
 * getBrassinCollectionController.php
 *
 * Contrôleur gérant l'action "get-brassin-collection".
 * Récupère l'ensemble des brassins dans la collection "brassin".
 */

require_once __DIR__ . '/../Services/MongoDBService.php';
require_once __DIR__ . '/../Services/TokenService.php';

function getBrassinCollectionController(array $data)
{
    // 1. (Optionnel) Vérifier la présence et la validité du token
    if (empty($data['token'])) {
        http_response_code(400);
        echo json_encode([
            'status'  => 'ERROR',
            'message' => 'Token missing in request'
        ]);
        return;
    }

    // Vérification de validité du token
    // (si vous souhaitez autoriser seulement les utilisateurs connectés)
    $userId = TokenService::checkTokenAndGetUserId($tokenValue);
    if (!$userId) {
        http_response_code(401);
        echo json_encode([
            'status'  => 'ERROR',
            'message' => 'Invalid or expired token'
        ]);
        return;
    }

    // 2. Connexion à la collection "brassin"
    $mongoDb = MongoDBService::getInstance();
    $brassinCollection = $mongoDb->selectCollection('brassin');

    // 3. Récupérer la liste des brassins (triés par date_creation décroissante, par exemple)
    $cursor = $brassinCollection->find([], [
        'sort' => ['date_creation' => -1]
    ]);

    // 4. Construire un tableau à renvoyer
    $brassins = [];
    foreach ($cursor as $doc) {
        $brassins[] = [
            'brassin_id'   => (string)($doc['_id'] ?? ''),
            'user_id'      => isset($doc['user_id']) ? (string)$doc['user_id'] : '',
            'titre'        => $doc['titre'] ?? '',
            'date_creation'=> isset($doc['date_creation']) 
                              ? $doc['date_creation']->toDateTime()->format('Y-m-d H:i:s') 
                              : ''
        ];
    }

    // 5. Retourner la réponse JSON
    echo json_encode([
        'status'   => 'OK',
        'brassins' => $brassins
    ]);
}

