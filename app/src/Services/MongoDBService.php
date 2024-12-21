<?php
// src/Services/MongoDBService.php

require_once __DIR__ . '/../../config/app_config.php';
use MongoDB\Client;

class MongoDBService
{
    private static $instance = null;

    public static function getInstance()
    {
        if (self::$instance === null) {
            // creer une nouvelle connexion
            $mongoClient = new Client(
                "mongodb://" . MONGO_USER. ':' . MONGO_PASSWORD . '@' . MONGO_HOST . ":" . MONGO_PORT,
                [],
                ['typeMap' => ['array' => 'array','document' => 'array','root' => 'array']]
            );
            self::$instance = $mongoClient->{MONGO_DBNAME};
        }
        return self::$instance;
    }
}

