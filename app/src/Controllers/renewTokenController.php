<?php
/**
 * renewTokenController.php
 *
 * Controleur gerant l'action "renew-token".
 * Genere un nouveau token pour l'utilisateur qui s'authentifie avec un token existant,
 * sans supprimer l'ancien token.
 */

require_once __DIR__ . '/../Services/TokenService.php';
require_once __DIR__ . '/../Services/MongoDBService.php';

use MongoDB\BSON\UTCDateTime;

function renewTokenController(array $data)
{
    // 1. Verifier la presence du token existant
    if (empty($data['token'])) {
        http_response_code(400);
        echo json_encode([
            'status'  => 'ERROR',
            'message' => 'Token missing in request'
        ]);
        return;
    }
    $oldTokenValue = $data['token'];

    // 2. Verifier la validite du token => recuperer l'user_id
    $userId = \App\Services\TokenService::checkTokenAndGetUserId($oldTokenValue);
    if (!$userId) {
        // Token invalide ou expire
        http_response_code(401);
        echo json_encode([
            'status'  => 'ERROR',
            'message' => 'Invalid or expired token'
        ]);
        return;
    }

    // 3. Generer le nouveau token
    $newTokenValue = bin2hex(random_bytes(16)); // par ex. 32 caracteres hexa
    $dateCreation  = new UTCDateTime(); 
    // Duree de validite ex. +1h
    $dateFinValidite = new UTCDateTime((time() + 3600) * 1000); 

    // 4. Inserer le nouveau token dans la collection token
    $mongoDb = MongoDBService::getInstance();
    $tokenCollection = $mongoDb->selectCollection('token');

    $insertResult = $tokenCollection->insertOne([
        'user_id'          => $userId,
        'valeur_token'     => $newTokenValue,
        'date_creation'    => $dateCreation,
        'date_fin_validite'=> $dateFinValidite
    ]);

    // 5. Retourner le nouveau token
    echo json_encode([
        'status'      => 'OK',
        'message'     => 'New token generated successfully',
        'new_token'   => $newTokenValue
    ]);
}

