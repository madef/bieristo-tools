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
define('SMTP_HOST', getenv('SMTP_HOST'));
define('SMTP_PORT', getenv('SMTP_PORT'));
define('SMTP_PROTOCOL', getenv('SMTP_PROTOCOL'));
define('SMTP_USERNAME', getenv('SMTP_USERNAME'));
define('SMTP_PASSWORD', getenv('SMTP_PASSWORD'));
define('SMTP_SENDER_EMAIL', getenv('SMTP_SENDER_EMAIL'));
define('SMTP_SENDER_LABEL', getenv('SMTP_SENDER_LABEL'));
// Le sel pour hasher les emails
define('APP_SALT', '0a7a03a7e75a422974fb55b1f2b80180');
