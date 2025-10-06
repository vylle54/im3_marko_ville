<?php

$fact = "Scheiss GC!";
echo $fact;

echo '<br>';

echo "GC GC die Scheisse vom SEE!";

$note = 3.75;
if($note >= 4) {
    echo "Bestanden";
} else if($note < 4 && $note >= 3.5) {
    echo "Probiers nochmal";
} else {
    echo "Nicht bestanden";
}

$bananen = ['mama banane', 'papa banane', 'baby banane'];

echo '<pre>';
print_r($bananen);
echo '</pre>';

foreach($bananen as $banane) {
    echo $banane . '<br>';
}

// -> associative arrays (aka. objekte)
$standorte = [
    'chur' => 7000,
    'zuerich' => 8000,
    'bern' => 3000
];

foreach($standorte as $stadt => $plz) {
    echo $stadt . '/' . $plz . '<br>';
}