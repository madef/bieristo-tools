<?php
// Extrait le token depuis l'URL
$token = isset($_GET['token']) ? $_GET['token'] : '';
$token = preg_replace('/[^a-zA-Z0-9]/', '', $token);

// En-tete HTML minimaliste
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Enregistrement du token</title>
</head>
<body>
<script>
// Enregistre le token recupere dans localStorage
localStorage.setItem('token', '<?= $token; ?>')

// Force le recheck du token
localStorage.removeItem('lastCheckToken')

// Redirige vers la page d'accueil
window.location.href = '/';
</script>
</body>
</html>
