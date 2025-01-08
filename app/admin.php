#!/usr/bin/env php
<?php
/**
 * admin.php
 *
 * Script CLI d'administration MongoDB pour :
 *   - list-tokens
 *   - list-users
 *   - user <user_id>
 *   - delete-user <user_id>
 *
 * Usage :
 *   php admin.php list-tokens
 *   php admin.php list-users
 *   php admin.php user 64abc123...
 *   php admin.php delete-user 64abc123...
 */

require __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/config/app_config.php'; // Définit MONGO_HOST, MONGO_PORT, MONGO_DBNAME
use MongoDB\Client;
use MongoDB\BSON\ObjectId;
use MongoDB\BSON\UTCDateTime;

/**
 * Affiche l'usage du script si la commande n'est pas reconnue
 */
function printUsage()
{
    echo "Usage:\n";
    echo "  php admin.php list-tokens\n";
    echo "  php admin.php list-users\n";
    echo "  php admin.php user <user_id>\n";
    echo "  php admin.php delete-user <user_id>\n";
    exit(1);
}

/**
 * Connexion à MongoDB
 */
function getMongoDB()
{
    static $db = null;
    if ($db === null) {
        try {
            $client = new Client("mongodb://" . MONGO_USER. ':' . MONGO_PASSWORD . '@' . MONGO_HOST . ":" . MONGO_PORT . "/" . MONGO_DBNAME);
            $db = $client->{MONGO_DBNAME};
        } catch (Exception $e) {
            echo "Erreur de connexion à MongoDB : " . $e->getMessage() . PHP_EOL;
            exit(1);
        }
    }
    return $db;
}

// Analyser les arguments CLI
if ($argc < 2) {
    printUsage();
}
$command = $argv[1];

// Préparer la connexion
$db = getMongoDB();

// ----------------------------------------------------
// Commande: list-tokens
// ----------------------------------------------------
if ($command === 'list-tokens') {
    $userCollection = $db->selectCollection('token');
    $cursor = $userCollection->find([], ['sort' => ['date_creation' => -1]]);

    echo "Liste des tokens:\n";
    foreach ($cursor as $doc) {
        $tokenId = (string)$doc['_id'];
        $tokenValue = $doc['valeur_token'] ?? 'inconnu';
        $encodedEmail = $doc['encoded_email'] ?? 'inconnu';

        // Conversion en timestamp
        $dateCreation = $doc['date_creation'] instanceof UTCDateTime 
            ? $doc['date_creation']->toDateTime()->format('Y-m-d H:i:s') 
            : 'inconnu';

        $dateFinValidite = $doc['date_fin_validite'] instanceof UTCDateTime 
            ? $doc['date_fin_validite']->toDateTime()->format('Y-m-d H:i:s') 
            : 'inconnu';

        echo "--------------------------------------\n";
        echo "Token ID       : $tokenId\n";
        echo "Valeur token   : $tokenValue\n";
        echo "Email encode   : $encodedEmail\n";
        echo "Date creation  : $dateCreation\n";
        echo "Date expiration: $dateFinValidite\n";
    }
    echo "--------------------------------------\n";
    exit(0);
}

// ----------------------------------------------------
// Commande: list-users
// ----------------------------------------------------
if ($command === 'list-users') {
    $userCollection = $db->selectCollection('user');
    $cursor = $userCollection->find([], ['sort' => ['date_creation' => -1]]);

    echo "Liste des utilisateurs:\n";
    foreach ($cursor as $doc) {
        $id = (string)$doc['_id'];
        $encodedEmail = $doc['encoded_email'] ?? '(N/A)';
        $dateCreat    = '';

        if (!empty($doc['date_creation']) && $doc['date_creation'] instanceof UTCDateTime) {
            $dateCreat = $doc['date_creation']->toDateTime()->format('Y-m-d H:i:s');
        }

        echo "--------------------------------------\n";
        echo "User ID       : $id\n";
        echo "encoded_email : $encodedEmail\n";
        echo "date_creation : $dateCreat\n";
    }
    echo "--------------------------------------\n";
    exit(0);
}

// ----------------------------------------------------
// Commande: user <user_id>
// ----------------------------------------------------
if ($command === 'user') {
    if ($argc < 3) {
        echo "user_id manquant\n";
        printUsage();
    }
    $userIdInput = $argv[2];
    try {
        $userObjectId = new ObjectId($userIdInput);
    } catch (Exception $e) {
        echo "Format de user_id invalide\n";
        exit(1);
    }

    $userCollection = $db->selectCollection('user');
    $doc = $userCollection->findOne(['_id' => $userObjectId]);

    if (!$doc) {
        echo "Aucun user trouvé pour _id=$userIdInput\n";
        exit(0);
    }

    // Partie du code a modifier : affichage formate du user
    echo "Informations pour l'utilisateur _id=$userIdInput:\n";
    echo "-------------------------------------------------\n";
    echo "User ID         : " . (string)$doc['_id'] . "\n";
    echo "encoded_email   : " . ($doc['encoded_email'] ?? 'N/A') . "\n";

    if (isset($doc['date_creation']) && $doc['date_creation'] instanceof UTCDateTime) {
        echo "date_creation   : "
             . $doc['date_creation']->toDateTime()->format('Y-m-d H:i:s')
             . "\n";
    } else {
        echo "date_creation   : (inconnue)\n";
    }

    // Ex. si vous stockez unity ou autre champ
    if (isset($doc['data'])) {
        // S'il s'agit d'un objet / tableau
        echo "data            : " . json_encode($doc['data']) . "\n";
    }
    echo "-------------------------------------------------\n";

    exit(0);
}

// ----------------------------------------------------
// Commande: delete-user <user_id>
// ----------------------------------------------------
if ($command === 'delete-user') {
    if ($argc < 3) {
        echo "user_id manquant\n";
        printUsage();
    }
    $userIdInput = $argv[2];

    try {
        $userObjectId = new ObjectId($userIdInput);
    } catch (Exception $e) {
        echo "Format de user_id invalide\n";
        exit(1);
    }

    $userCollection = $db->selectCollection('user');

    // Supprimer le user
    $deleteUserResult = $userCollection->deleteOne(['_id' => $userObjectId]);
    if ($deleteUserResult->getDeletedCount() < 1) {
        echo "Erreur: aucun user supprimé. user_id=$userIdInput existe-t-il ?\n";
        exit(1);
    }

    echo "Utilisateur $userIdInput supprimé avec succès.\n";
    exit(0);
}

// Si la commande ne correspond à rien :
printUsage();

