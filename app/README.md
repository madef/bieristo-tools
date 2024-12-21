# Structure du projet

- **install.php**  
  Script d'installation a executer en ligne de commande pour initialiser la base MongoDB et generer le sel (dans `config/app_config.php`).

- **config/app_config.php**  
  Fichier de configuration generique (host, ports, salt). Rempli par `install.php`.

- **public/index.php**  
  Point d'entree unique de l'application (API). Recupere les requetes JSON et les redirige vers les controleurs adequats.

- **src/Controllers**  
  Contient les classes qui gerent chaque action (ask-token, check-token, brassin, etc.).

- **src/Services**  
  Logique metier transversale (connexion MongoDB, hashing email, envoi mail, etc.).

- **src/Models**  
  Definition des schemas ou modeles pour les collections (User, Token, Brassin, History).

## Comment demarrer

1. **Initialiser le projet** en lancant ce script Bash :  
   ```bash
   ./init_project.sh
