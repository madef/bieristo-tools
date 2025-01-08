#!/usr/bin/env bash
#
# Script d'initialisation de la structure du projet
# Execution : ./init_project.sh
#

# 1. Creation des dossiers necessaires
echo "Creation des repertoires..."

mkdir -p config
mkdir -p public
mkdir -p src/Controllers
mkdir -p src/Services
mkdir -p src/Models

echo "Repertoires crees."

# 2. Creation du script install.php
#    Ce fichier sera execute plus tard pour initialiser la base MongoDB et generer un sel
echo "Creation du fichier install.php..."

cat << 'EOF' > install.php
#!/usr/bin/env php
<?php
/**
 * Script d'installation pour initialiser la base MongoDB
 * et generer le fichier de configuration (config/app_config.php).
 *
 * Execution: php install.php
 */

// --- Votre code d'installation viendra ici ---
// Par exemple : connexion a MongoDB, creation des collections, generation du sel, etc.

echo "Script d'installation a completer." . PHP_EOL;
EOF

chmod +x install.php
echo "install.php cree."

# 3. Creation du fichier de configuration app_config.php (vide par defaut)
echo "Creation du fichier config/app_config.php..."

cat << 'EOF' > config/app_config.php
<?php
/**
 * Fichier de configuration de l'application.
 * Ce fichier sera mis a jour lors de l'execution de install.php
 */

// define('MONGO_HOST', 'localhost');
// define('MONGO_PORT', 27017);
// define('MONGO_DBNAME', 'maBase');
// define('APP_SALT', 'xxxxx');
EOF

echo "config/app_config.php cree."

# 4. Creation du point d'entree public/index.php
echo "Creation du fichier public/index.php..."

cat << 'EOF' > public/index.php
<?php
/**
 * Point d'entree unique de l'API.
 * Les requetes JSON arrivent ici, decodees, puis redirigees
 * vers le controleur correspondant a l'action demandee.
 */

// Exemple minimaliste
header('Content-Type: application/json');

// Recupere le corps brut de la requete
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true) ?? [];

// Securite basique: verifie qu'on a bien une action
if (!isset($data['action'])) {
    echo json_encode(['error' => 'No action provided']);
    exit;
}

$action = $data['action'];

// TODO: connexion a MongoDB, router vers le controleur adequat, etc.

echo json_encode([
    'status' => 'OK',
    'message' => "Action recue: $action"
]);
EOF

echo "public/index.php cree."

# 5. Ajout de placeholders pour src/Controllers, src/Services et src/Models
echo "Initialisation des repertoires src/Controllers, src/Services et src/Models..."

# Creer des fichiers .gitkeep ou un README pour garder ces dossiers dans le repo
touch src/Controllers/.gitkeep
touch src/Services/.gitkeep
touch src/Models/.gitkeep

echo "Placeholders crees dans src/Controllers, src/Services et src/Models."

# 6. (Optionnel) Creation d'un README.md pour decrire la structure du projet
echo "Creation d'un README.md..."

cat << 'EOF' > README.md
# Structure du projet

- **install.php**  
  Script d'installation a executer en ligne de commande pour initialiser la base MongoDB et generer le sel (dans `config/app_config.php`).

- **config/app_config.php**  
  Fichier de configuration generique (host, ports, salt). Rempli par `install.php`.

- **public/index.php**  
  Point d'entree unique de l'application (API). Recupere les requetes JSON et les redirige vers les controleurs adequats.

- **src/Controllers**  
  Contient les classes qui gerent chaque action (ask-token, check-token, etc.).

- **src/Services**  
  Logique metier transversale (connexion MongoDB, hashing email, envoi mail, etc.).

- **src/Models**  
  Definition des schemas ou modeles pour les collections (User, Token, ).

## Comment demarrer

1. **Initialiser le projet** en lancant ce script Bash :  
   ```bash
   ./init_project.sh
EOF

echo "README.md cree."

