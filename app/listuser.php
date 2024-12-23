#!/usr/bin/env php
<?php
/**
 * list_users.php
 *
 * Script CLI pour lister tous les utilisateurs (collection user).
 */

require_once __DIR__ . '/config/app_config.php'; // Fichier contenant MONGO_HOST, MONGO_PORT, MONGO_DBNAME

require __DIR__ . '/vendor/autoload.php';
use MongoDB\Client;
use MongoDB\BSON\UTCDateTime;

try {
    $mongoClient = new Client("mongodb://" . MONGO_USER. ':' . MONGO_PASSWORD . '@' . MONGO_HOST . ":" . MONGO_PORT . "/" . MONGO_DBNAME);
    $db = $mongoClient->{MONGO_DBNAME};
    $userCollection = $db->selectCollection('user');
} catch (Exception $e) {
    echo "Erreur de connexion a MongoDB : " . $e->getMessage() . PHP_EOL;
    exit(1);
}

$cursor = $userCollection->find(
    [],
    [ 'sort' => ['date_creation' => -1] ]  // Optionnel : trie par date_creation decroissant
);

echo "Liste des users dans la base '".MONGO_DBNAME."' :\n";
foreach ($cursor as $userDoc) {
    $userId       = (string)$userDoc['_id'];
    $encodedEmail = $userDoc['encoded_email'] ?? 'N/A';

    $dateCreation = '';
    if (isset($userDoc['date_creation']) && $userDoc['date_creation'] instanceof UTCDateTime) {
        $dateCreation = $userDoc['date_creation']->toDateTime()->format('Y-m-d H:i:s');
    }

    echo "--------------------------------------\n";
    echo "User ID        : $userId\n";
    echo "encoded_email  : $encodedEmail\n";
    echo "date_creation  : $dateCreation\n";
}
echo "--------------------------------------\n";
echo "Fin de la liste.\n";
exit(0);

