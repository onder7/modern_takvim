<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

function getFuelPrices($city = 'ISTANBUL (AVRUPA)') {
    $html = file_get_contents('https://www.petrolofisi.com.tr/akaryakit-fiyatlari');
    
    try {
        // Şehir id'lerini ve isimlerini eşleştir
        $cityData = [];
        preg_match_all('/<tr class="price-row district-(\d+)"[^>]*data-disctrict-name="([^"]+)"/', $html, $cityMatches);
        foreach ($cityMatches[1] as $index => $id) {
            $cityData[$cityMatches[2][$index]] = $id;
        }

        // Tüm fiyat verilerini al
        $prices = [];
        preg_match_all('/<tr class="price-row district-\d+"[^>]*>.*?<td>([^<]+)<\/td>\s*<td[^>]*>\s*<span class="with-tax">([\d.]+)<\/span>.*?<td[^>]*>\s*<span class="with-tax">([\d.]+)<\/span>.*?<td[^>]*>\s*<span class="with-tax">([\d.]+)<\/span>/s', $html, $matches, PREG_SET_ORDER);

        foreach ($matches as $match) {
            $cityName = trim($match[1]);
            $prices[$cityName] = [
                'city' => $cityName,
                'benzin' => $match[2],
                'motorin' => $match[3],
                'lpg' => $match[4]
            ];
        }

        // İstenen şehrin verilerini döndür
        if (isset($prices[$city])) {
            return [
                'success' => true,
                'data' => $prices[$city],
                'cities' => array_keys($prices),
                'lastUpdate' => date('Y-m-d H:i:s')
            ];
        } else {
            throw new Exception('Şehir bulunamadı');
        }
        
    } catch (Exception $e) {
        return [
            'success' => false,
            'error' => $e->getMessage(),
            'cities' => array_keys($prices ?? [])
        ];
    }
}

$city = $_GET['city'] ?? 'ISTANBUL (AVRUPA)';
echo json_encode(getFuelPrices($city));
?>