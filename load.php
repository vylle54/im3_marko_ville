<?php
include 'transform.php';
require_once 'config.php';
// Ich erstelle hier ein PDO-Objekt für die Datenbankverbindung
try {
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // --- SQL command ---
    $sql = "INSERT INTO im3 (base_code, currency, rate)
            VALUES (:base_code, :currency, :rate)";
    $stmt = $pdo->prepare($sql);

    // --- Zeilenweise einfügen ---
    foreach ($transformedData as $row) {
        $stmt->execute([
            ':base_code' => $row['base_code'],
            ':currency'  => $row['currency'],
            ':rate'      => $row['rate']
        ]);
    }

    echo "✅ Daten erfolgreich eingefügt.\n";

} catch (PDOException $e) {
    echo "❌ Datenbankfehler: " . $e->getMessage();
}
?>
