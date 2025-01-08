<?php
/**
 * checkTokenController.php
 *
 * Controleur gerant l'action "check-token".
 *
 * Objectif :
 * 1. Recuperer le token (valeur_token) depuis la requete.
 * 2. Verifier son existence et son expiration dans la collection 'token'.
 * 3. Si valide, verifier si un user existe deja avec encoded_email.
 *    - S'il n'existe pas, le creer dans la collection 'user'.
 * 4. Retourner un statut et, eventuellement, l'_id du user.
 */

require_once __DIR__ . '/../Services/EmailHashService.php';
require_once __DIR__ . '/../Services/MongoDBService.php';

function checkTokenController(array $data)
{
    // 1. Recuperation du token
    if (empty($data['token'])) {
        http_response_code(400);
        echo json_encode([
            'status' => 'ERROR',
            'message' => 'Api:CheckToken:invalid',
        ]);
        return;
    }
    $tokenValue = $data['token'];

    // 2. Connexion MongoDB
    $mongoDb = MongoDBService::getInstance();
    $tokenCollection = $mongoDb->selectCollection('token');

    // 3. Recherche du document 'token' correspondant
    //    On verifie aussi la date_fin_validite
    $nowBson = new MongoDB\BSON\UTCDateTime(time() * 1000);
    // Requete : on cherche le tokenValue et date_fin_validite > maintenant
    $tokenDoc = $tokenCollection->findOne([
        'valeur_token' => $tokenValue,
        'date_fin_validite' => ['$gt' => $nowBson]
    ]);

    if (!$tokenDoc) {
        // Token non trouve ou expire
        http_response_code(401);
        echo json_encode([
            'status' => 'ERROR',
            'message' => 'Api:CheckToken:invalid',
        ]);
        return;
    }

    // 4. Le token existe et est valide => Verifier si un user existe deja
    //    On recupere l'encoded_email depuis le tokenDoc
    $encodedEmail = $tokenDoc['encoded_email'] ?? null;
    if (!$encodedEmail) {
        http_response_code(500);
        echo json_encode([
            'status' => 'ERROR',
            'message' => 'Api:CheckToken:invalid',
        ]);
        return;
    }

    $userCollection = $mongoDb->selectCollection('user');

    // 5. On tente de retrouver un user associe a cet encoded_email
    $userDoc = $userCollection->findOne([
        'encoded_email' => $encodedEmail
    ]);

    // 6. S'il n'existe pas, on le cree
    if (!$userDoc) {
        $insertResult = $userCollection->insertOne([
            'encoded_email' => $encodedEmail,
            'date_creation' => new MongoDB\BSON\UTCDateTime()
        ]);
    }

    // 7. Reponse au client
    echo json_encode([
        'status'  => 'OK',
        'message' => 'Api:CheckToken:success',
    ]);
}

