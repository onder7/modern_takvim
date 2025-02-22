<?php
header('Content-Type: application/json');
require_once 'ExchangeRateAPI.php';

try {
    $api = new ExchangeRateAPI();
    $rates = $api->getRates('USD');
    echo json_encode($rates);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}