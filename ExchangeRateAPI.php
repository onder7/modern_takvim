<?php
class ExchangeRateAPI {
    private $apiKey = '97cbc099a9d9a21383be604b';
    private $baseUrl = 'https://v6.exchangerate-api.com/v6/';
    private $cache_file = 'exchange_rates_cache.json';
    private $cache_time = 3600; // 1 saat cache süresi

    public function getRates($base_currency = 'USD') {
        // Cache kontrolü
        if ($this->isCacheValid()) {
            return $this->getFromCache();
        }

        $url = $this->baseUrl . $this->apiKey . '/latest/' . $base_currency;
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        
        $response = curl_exec($ch);
        
        if (curl_errno($ch)) {
            throw new Exception('Curl Error: ' . curl_error($ch));
        }
        
        curl_close($ch);
        
        $data = json_decode($response, true);
        
        if ($data['result'] === 'success') {
            // Cache'e kaydet
            $this->saveToCache($data);
            return $data;
        } else {
            throw new Exception('API Error: ' . ($data['error-type'] ?? 'Unknown error'));
        }
    }

    private function isCacheValid() {
        if (!file_exists($this->cache_file)) {
            return false;
        }

        $cache_time = filemtime($this->cache_file);
        return (time() - $cache_time) < $this->cache_time;
    }

    private function getFromCache() {
        return json_decode(file_get_contents($this->cache_file), true);
    }

    private function saveToCache($data) {
        file_put_contents($this->cache_file, json_encode($data));
    }

    // Belirli para birimleri için dönüşüm hesapla
    public function calculateExchange($amount, $from_currency, $to_currency) {
        $rates = $this->getRates($from_currency);
        
        if (isset($rates['conversion_rates'][$to_currency])) {
            return $amount * $rates['conversion_rates'][$to_currency];
        }
        
        throw new Exception('Invalid currency pair');
    }
}