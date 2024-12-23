#!/usr/bin/env php
<?php
/**
 * Script d'installation pour initialiser la base MongoDB
 * et generer le fichier de configuration (app_config.php).
 *
 * Execution : php install.php
 */

require __DIR__ . '/vendor/autoload.php';
use MongoDB\Client;

// 1. Generation du sel unique pour l'application
$salt = bin2hex(random_bytes(16)); // 32 caracteres hexadecimaux

// 2. Creation du repertoire config s'il n'existe pas
$configDir = __DIR__ . '/config';
if (!is_dir($configDir)) {
    mkdir($configDir, 0755, true);
}

// 3. Ecriture du fichier de configuration app_config.php
$configFile = $configDir . '/app_config.php';
$appConfigContents = <<<PHP
<?php
/**
 * Fichier de configuration de l'application.
 * ATTENTION : ne pas versionner ce fichier en clair ou le proteger.
 */
define('APP_URL', getenv('APP_URL'));
define('MONGO_USER', getenv('MONGO_USER'));
define('MONGO_PASSWORD', getenv('MONGO_PASSWORD'));
define('MONGO_HOST', getenv('MONGO_HOST'));
define('MONGO_PORT', getenv('MONGO_PORT'));
define('MONGO_DBNAME', getenv('MONGO_DBNAME'));
define('SMTP_HOST', getenv('SMTP_HOST'));
define('SMTP_PORT', getenv('SMTP_PORT'));
define('SMTP_PROTOCOL', getenv('SMTP_PROTOCOL'));
define('SMTP_USERNAME', getenv('SMTP_USERNAME'));
define('SMTP_PASSWORD', getenv('SMTP_PASSWORD'));
define('SMTP_SENDER_EMAIL', getenv('SMTP_SENDER_EMAIL'));
define('SMTP_SENDER_LABEL', getenv('SMTP_SENDER_LABEL'));
// Le sel pour hasher les emails
define('APP_SALT', '{$salt}');
PHP;

// Ecriture sur le disque
file_put_contents($configFile, $appConfigContents);

// 4. Connexion a MongoDB
// Necessite l'extension MongoDB et la classe MongoDB\Client
try {
    // On recupere les parametres du fichier config qu'on vient de creer
    require_once $configFile;

    // Import de la classe Client (assurez-vous que l'extension MongoDB est installee)
    // composer require mongodb/mongodb  (s'il est possible d'utiliser Composer)
    // Sinon, extension native : extension=mongodb.so
    $mongo = new MongoDB\Client("mongodb://" . MONGO_USER. ':' . MONGO_PASSWORD . '@' . MONGO_HOST . ":" . MONGO_PORT . "/" . MONGO_DBNAME);
    $db = $mongo->{MONGO_DBNAME};

    echo "Connexion a MongoDB reussie sur la base : " . MONGO_DBNAME . PHP_EOL;
} catch (Exception $e) {
    echo "Erreur lors de la connexion a MongoDB : " . $e->getMessage() . PHP_EOL;
    exit(1);
}

// 5. Creation/Verification des collections et index
// a) Collection user
try {
    // Pas besoin d'appeler createCollection si l'on veut juste la forcer a exister,
    // il suffit de s'assurer qu'on ecrit dedans ou qu'on cree un index.
    $db->createCollection('user');
    echo "Collection 'user' creee ou deja existante." . PHP_EOL;

    // Optionnel : creation d'un index sur encoded_email pour les recherches
    $db->user->createIndex(['encoded_email' => 1], ['unique' => true]);
    echo "Index sur encoded_email cree (unique)." . PHP_EOL;
} catch (Exception $e) {
    echo "Erreur creation user collection : " . $e->getMessage() . PHP_EOL;
}

// b) Collection token
try {
    $db->createCollection('token');
    echo "Collection 'token' creee ou deja existante." . PHP_EOL;

    // Creation d'un index TTL sur date_fin_validite
    // expireAfterSeconds=0 supprime le document a la date stockee dans date_fin_validite
    $db->token->createIndex(['date_fin_validite' => 1], ['expireAfterSeconds' => 0]);
    echo "Index TTL sur la date_fin_validite cree." . PHP_EOL;
} catch (Exception $e) {
    echo "Erreur creation token collection : " . $e->getMessage() . PHP_EOL;
}

// c) Collection brassin
try {
    $db->createCollection('brassin');
    echo "Collection 'brassin' creee ou deja existante." . PHP_EOL;
} catch (Exception $e) {
    echo "Erreur creation brassin collection : " . $e->getMessage() . PHP_EOL;
}

// d) Collection history
try {
    $db->createCollection('history');
    echo "Collection 'history' creee ou deja existante." . PHP_EOL;
} catch (Exception $e) {
    echo "Erreur creation history collection : " . $e->getMessage() . PHP_EOL;
}

// 6. Fin du script
echo "Installation terminee avec succes." . PHP_EOL;
exit(0);

