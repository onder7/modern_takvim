<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS ayarları
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');

// API anahtarınızı buraya girin
$apiKey = '';

// Şehir parametresini al
$city = isset($_GET['city']) ? $_GET['city'] : '';

if (empty($city)) {
    http_response_code(400);
    echo json_encode(['error' => ['message' => 'Şehir parametresi gerekli']]);
    exit;
}

// API URL'sini oluştur
$apiUrl = "http://api.weatherapi.com/v1/current.json?key={$apiKey}&q={$city},turkey&aqi=no";

// cURL oturumu başlat
$ch = curl_init();

// cURL seçeneklerini ayarla
curl_setopt_array($ch, [
    CURLOPT_URL => $apiUrl,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "GET",
    CURLOPT_HTTPHEADER => [
        "cache-control: no-cache"
    ]
]);

// API'den veriyi al
$response = curl_exec($ch);
$err = curl_error($ch);

// cURL oturumunu kapat
curl_close($ch);

// Hata kontrolü
if ($err) {
    http_response_code(500);
    echo json_encode([
        'error' => [
            'message' => 'cURL Error: ' . $err,
            'type' => 'CURL_ERROR'
        ]
    ]);
    exit;
}

// API yanıtını kontrol et
$data = json_decode($response, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(500);
    echo json_encode([
        'error' => [
            'message' => 'JSON Decode Error: ' . json_last_error_msg(),
            'type' => 'JSON_ERROR',
            'response' => $response
        ]
    ]);
    exit;
}

// API yanıtını ilet
echo $response;