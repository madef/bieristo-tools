#!/usr/bin/env php
<?php
/**
 * list_tokens.php
 *
 * Script en CLI qui liste les tokens stockes dans la collection 'token',
 * tries du plus recent au plus ancien via 'date_creation'.
 */

require_once __DIR__ . '/config/app_config.php'; // Fichier de config avec MONGO_HOST, MONGO_PORT, MONGO_DBNAME
// Assurez-vous aussi d'avoir la classe MongoDB\Client disponible
// par exemple via: composer require mongodb/mongodb (ou extension PHP native)

require __DIR__ . '/vendor/autoload.php';
use MongoDB\Client;
use MongoDB\BSON\UTCDateTime;

try {
    $mongoClient = new Client("mongodb://" . MONGO_USER. ':' . MONGO_PASSWORD . '@' . MONGO_HOST . ":" . MONGO_PORT . "/" . MONGO_DBNAME);
    $db = $mongoClient->{MONGO_DBNAME};
    $tokenCollection = $db->selectCollection('token');
} catch (Exception $e) {
    echo "Erreur de connexion a MongoDB : " . $e->getMessage() . PHP_EOL;
    exit(1);
}

// Requete : on recupere les tokens, tries par 'date_creation' decroissant
$cursor = $tokenCollection->find(
    [],
    [
        'sort' => ['date_creation' => -1]  // -1 => ordre decroissant (le plus recent en premier)
    ]
);

echo "Liste des tokens dans la base '".MONGO_DBNAME."' :\n";
foreach ($cursor as $tokenDoc) {
    $tokenId = (string)$tokenDoc['_id'];
    $tokenValue = $tokenDoc['valeur_token'] ?? 'inconnu';
    $encodedEmail = $tokenDoc['encoded_email'] ?? 'inconnu';

    // Conversion en timestamp
    $dateCreation = $tokenDoc['date_creation'] instanceof UTCDateTime 
        ? $tokenDoc['date_creation']->toDateTime()->format('Y-m-d H:i:s') 
        : 'inconnu';

    $dateFinValidite = $tokenDoc['date_fin_validite'] instanceof UTCDateTime 
        ? $tokenDoc['date_fin_validite']->toDateTime()->format('Y-m-d H:i:s') 
        : 'inconnu';

    echo "--------------------------------------\n";
    echo "Token ID       : $tokenId\n";
    echo "Valeur token   : $tokenValue\n";
    echo "Email encode   : $encodedEmail\n";
    echo "Date creation  : $dateCreation\n";
    echo "Date expiration: $dateFinValidite\n";
}

echo "--------------------------------------\n";
echo "Fin de la liste.\n";
exit(0);

