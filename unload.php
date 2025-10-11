<?php

require_once 'config.php';
header('Content-Type: application/json');

try {
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // --- SQL command ---
    $sql = "SELECT * FROM `im3` ";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($results, JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    http_response_code(500);
    echo "❌ Datenbankfehler: " . $e->getMessage();
}
