<?php
/**
 * TokenService.php
 *
 * Service de verification et de gestion des tokens.
 */

require_once __DIR__ . '/MongoDBService.php'; // Pour la connexion a la base

use MongoDB\BSON\UTCDateTime;

class TokenService
{
    /**
     * Verifie le token et retourne l'user_id associe.
     * Retourne null si le token est invalide ou expire.
     *
     * @param string $tokenValue
     * @return MongoDB\BSON\ObjectId|null
     */
    public static function checkTokenAndGetUserId($tokenValue)
    {
        // Connexion a la base
        $mongoDb = MongoDBService::getInstance();
        $tokenCollection = $mongoDb->selectCollection('token');

        // Date courante en BSON (ms)
        $nowBson = new UTCDateTime(time() * 1000);

        // On cherche le doc token correspondant a la valeur du token
        // et dont la date_fin_validite n'est pas encore passee
        $tokenDoc = $tokenCollection->findOne([
            'valeur_token'      => $tokenValue,
            'date_fin_validite' => ['$gt' => $nowBson]
        ]);

        if (!$tokenDoc) {
            // Pas de token valide => on renvoie null
            return null;
        }

        // Si on souhaite etre sur que le champ user_id existe
        if (empty($tokenDoc['user_id'])) {
            // Si pas de user_id => token associe a aucun user
            return null;
        }

        // Retourne l'ObjectId du user
        // Ici, on laisse sous forme d'ObjectId
        return $tokenDoc['user_id'];
    }
}

