<?php
/**
 * askTokenController.php
 *
 * Controleur gerant l'action "ask-token"
 */

require_once __DIR__ . '/../Services/EmailHashService.php';   // exemple de service pour hasher l'email
require_once __DIR__ . '/../Services/MongoDBService.php';     // exemple de service pour connexion MongoDB
require_once __DIR__ . '/../Services/MailService.php';        // exemple de service pour sendmail

function askTokenController(array $data)
{
    // 1. Verifier la presence de l'email dans la requete
    if (empty($data['email'])) {
        http_response_code(400);
        echo json_encode([
            'status' => 'ERROR',
            'message' => 'Email missing in request'
        ]);
        return;
    }

    $email = $data['email'];

    // 2. Encoder l'email via un hash robuste avec sel (cf. APP_SALT)
    $encodedEmail = encodeEmail($email);

    // 3. Generer le token et preparer son expiration
    $tokenValue = bin2hex(random_bytes(16)); // 32 caracteres hexa
    $dateCreation = new MongoDB\BSON\UTCDateTime(); // maintenant
    // Duree de validite, ex. 3600 sec (1h). Ajuster selon le besoin.
    $dateFinValidite = new MongoDB\BSON\UTCDateTime((time() + 3600) * 1000);

    // 4. Stocker le token dans la collection 'token'
    //    On n'associe pas encore de user_id ici, car la creation user se fait dans check-token
    $mongoDb = MongoDBService::getInstance(); // exemple de pattern Singleton ou instance
    $tokenCollection = $mongoDb->selectCollection('token');

    $insertResult = $tokenCollection->insertOne([
        'encoded_email'     => $encodedEmail,
        'valeur_token'      => $tokenValue,
        'date_creation'     => $dateCreation,
        'date_fin_validite' => $dateFinValidite
    ]);

    // 5. Envoyer un mail a l'utilisateur
    $subject = "Votre token d'acces";
    $url = APP_URL . 'login.php?token=' . $tokenValue;
    $message = 'Bonjour,<br />Cliquez sur l\'url suivante pour vous connecter à l\'application : <a href="' . $url. '">' . $url . '</a>';
    sendmail($email, $subject, $message);

    // 6. Retourner la reponse JSON au client
    echo json_encode([
        'status' => 'OK',
        'message' => 'Token generated and sent',
        'token_id' => (string)$insertResult->getInsertedId()
    ]);
}

