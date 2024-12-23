#!/usr/bin/env php
<?php
/**
 * list_brassins.php
 *
 * Script CLI pour lister tous les brassins d'un user (collection brassin).
 * Usage: php list_brassins.php <user_id>
 */

require_once __DIR__ . '/config/app_config.php';
require __DIR__ . '/vendor/autoload.php';

use MongoDB\Client;
use MongoDB\BSON\ObjectId;
use MongoDB\BSON\UTCDateTime;

// Verification des arguments
if ($argc < 2) {
    echo "Usage: php list_brassins.php <user_id>\n";
    exit(1);
}

$userIdInput = $argv[1];

try {
    $userObjectId = new ObjectId($userIdInput);
} catch (Exception $e) {
    echo "L'argument fourni n'est pas un ObjectId valide.\n";
    exit(1);
}

try {
    $mongoClient = new Client("mongodb://" . MONGO_USER. ':' . MONGO_PASSWORD . '@' . MONGO_HOST . ":" . MONGO_PORT . "/" . MONGO_DBNAME);
    $db = $mongoClient->{MONGO_DBNAME};
    $brassinCollection = $db->selectCollection('brassin');
} catch (Exception $e) {
    echo "Erreur de connexion a MongoDB : " . $e->getMessage() . PHP_EOL;
    exit(1);
}

// Recherche des brassins correspondant a cet user_id
$cursor = $brassinCollection->find(
    ['user_id' => $userObjectId],
    ['sort' => ['date_creation' => -1]]
);

echo "Liste des brassins pour user_id = $userIdInput :\n";
foreach ($cursor as $brassinDoc) {
    $brassinId   = (string)$brassinDoc['_id'];
    $titre       = $brassinDoc['titre'] ?? 'N/A';
    $userId      = (string)($brassinDoc['user_id'] ?? 'N/A');

    $dateCreation = '';
    if (isset($brassinDoc['date_creation']) && $brassinDoc['date_creation'] instanceof UTCDateTime) {
        $dateCreation = $brassinDoc['date_creation']->toDateTime()->format('Y-m-d H:i:s');
    }

    echo "--------------------------------------\n";
    echo "Brassin ID     : $brassinId\n";
    echo "Titre          : $titre\n";
    echo "User ID        : $userId\n";
    echo "Date creation  : $dateCreation\n";
}
echo "--------------------------------------\n";
echo "Fin de la liste.\n";
exit(0);

