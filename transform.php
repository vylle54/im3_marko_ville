<?php
$data = include('extract.php');

$baseCode = $data['base_code'];

// --- Nur gewünschte Währungen ---
$wantedCurrencies = ['DKK', 'SEK'];

// --- Daten transformieren ---
$transformedData = [];
foreach ($data['rates'] as $currency => $rate) {
    if (in_array($currency, $wantedCurrencies)) {
        $transformedData[] = [
            'base_code' => $baseCode,
            'currency'  => $currency,
            'rate'      => round($rate, 1)
        ];
    }
}

print_r($transformedData); // Zum Debuggen: Zeigt die transformierten Daten an