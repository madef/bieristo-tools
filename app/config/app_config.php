<?php
/**
 * Fichier de configuration de l'application.
 * ATTENTION : ne pas versionner ce fichier en clair ou le proteger.
 */
define('MONGO_USER', getenv('MONGO_USER'));
define('MONGO_PASSWORD', getenv('MONGO_PASSWORD'));
define('MONGO_HOST', getenv('MONGO_HOST'));
define('MONGO_PORT', getenv('MONGO_PORT'));
define('MONGO_DBNAME', getenv('MONGO_DBNAME'));
// Le sel pour hasher les emails
define('APP_SALT', '0a7a03a7e75a422974fb55b1f2b80180');