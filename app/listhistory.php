#!/usr/bin/env php
<?php
/**
 * list_history.php
 *
 * Script CLI pour lister les historiques liés à tous les brassins d'un user donné.
 * Usage: php list_history.php <user_id>
 */

require_once __DIR__ . '/config/app_config.php';

require __DIR__ . '/vendor/autoload.php';
use MongoDB\Client;
use MongoDB\BSON\ObjectId;

if ($argc < 2) {
    echo "Usage: php list_history.php <user_id>\n";
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
    $historyCollection = $db->selectCollection('history');
} catch (Exception $e) {
    echo "Erreur de connexion a MongoDB : " . $e->getMessage() . PHP_EOL;
    exit(1);
}

// 1) Recuperer tous les brassins du user
$brassins = $brassinCollection->find(
    ['user_id' => $userObjectId],
    ['sort' => ['date_creation' => -1]]
);

echo "Liste de l'historique pour user_id = $userIdInput :\n";

foreach ($brassins as $brassinDoc) {
    $brassinId    = $brassinDoc['_id'];
    $brassinTitle = $brassinDoc['titre'] ?? 'Sans titre';

    // 2) Pour chaque brassin, lister l'historique
    $historyCursor = $historyCollection->find(
        ['brassin_id' => $brassinId]
    );

    echo "=== Brassin : ".(string)$brassinId." | Titre : $brassinTitle ===\n";

    $hasHistory = false;
    foreach ($historyCursor as $historyDoc) {
        $historyId = (string)$historyDoc['_id'];

        // L'historique peut avoir une structure flexible
        // On peut afficher le doc entier au format JSON
        echo "-- History ID: $historyId\n";
        echo json_encode($historyDoc, JSON_PRETTY_PRINT) . "\n";
        $hasHistory = true;
    }

    if (!$hasHistory) {
        echo "(Aucun document history pour ce brassin)\n";
    }

    echo "--------------------------------------\n";
}

echo "Fin de la liste.\n";
exit(0);

