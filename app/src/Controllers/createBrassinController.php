<?php
/**
 * createBrassinController.php
 *
 * Controleur gerant l'action "create-brassin".
 */

require_once __DIR__ . '/../Services/MongoDBService.php';  // pour la connexion a MongoDB
require_once __DIR__ . '/../Services/TokenService.php';    // pour verifier le token

function createBrassinController(array $data)
{
    // 1. Verifier la presence du token et du titre
    if (empty($data['token']) || empty($data['titre'])) {
        http_response_code(400);
        echo json_encode([
            'status' => 'ERROR',
            'message' => 'Token or titre missing in request'
        ]);
        return;
    }

    $tokenValue = $data['token'];
    $titre = $data['titre'];

    // 2. Verifier la validite du token et recuperer le user_id
    $userId = TokenService::checkTokenAndGetUserId($tokenValue);
    if (!$userId) {
        // Token invalide ou expire
        http_response_code(401);
        echo json_encode([
            'status' => 'ERROR',
            'message' => 'Invalid token'
        ]);
        return;
    }

    // 3. Creer le document brassin
    $mongoDb = MongoDBService::getInstance();
    $brassinCollection = $mongoDb->selectCollection('brassin');

    $insertResult = $brassinCollection->insertOne([
        'user_id'       => $userId,                         // reference du user
        'titre'         => $titre,
        'date_creation' => new MongoDB\BSON\UTCDateTime()    // ex. champ supplementaire
    ]);

    $brassinId = (string)$insertResult->getInsertedId();

    // 4. Retourner la reponse
    echo json_encode([
        'status'      => 'OK',
        'message'     => 'Brassin created',
        'brassin_id'  => $brassinId
    ]);
}

