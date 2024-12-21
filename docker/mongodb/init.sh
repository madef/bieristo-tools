#!/bin/bash
set -e

echo "---- Running init.sh with mongosh ----"

# Appel de mongosh en inline, en interpretant les variables d'environnement
mongosh <<EOF
// Basculer sur la base d'authentification (root) : admin
db = db.getSiblingDB("admin");

// Authentification root
db.auth({
  user: "${MONGO_INITDB_ROOT_USERNAME}",
  pwd: "${MONGO_INITDB_ROOT_PASSWORD}"
});

// Se placer sur la base dans laquelle on veut créer l'utilisateur
db = db.getSiblingDB("${MONGO_DBNAME}");

// Création de l'utilisateur applicatif
db.createUser({
  user: "${MONGO_USER}",
  pwd: "${MONGO_PASSWORD}",
  roles: [
    { role: "dbOwner", db: "${MONGO_DBNAME}" }
  ]
});

// Vérification rapide
print("User created in database '${MONGO_DBNAME}':");
db.getUsers().forEach(u => printjson(u));
EOF

echo "---- init.sh completed ----"

