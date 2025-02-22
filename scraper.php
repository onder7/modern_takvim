<?php
class NewsScraperByDate {
    private $baseUrl = 'https://anlatilaninotesi.com.tr/';
    private $date;
    
    public function __construct($date = null) {
        $this->date = $date ?? date('Ymd');
    }
    
    public function fetchNews() {
        try {
            $url = $this->baseUrl . $this->date . '/';
            
            $ch = curl_init();
            curl_setopt_array($ch, [
                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            ]);
            
            $response = curl_exec($ch);
            
            if (curl_errno($ch)) {
                throw new Exception('Curl error: ' . curl_error($ch));
            }
            
            curl_close($ch);
            
            $dom = new DOMDocument();
            @$dom->loadHTML($response, LIBXML_NOERROR);
            $xpath = new DOMXPath($dom);
            
            $newsItems = [];
            
            $newsLinks = $xpath->query('//a[@class="list__title"]');
            foreach ($newsLinks as $link) {
                $title = $link->getAttribute('title');
                $url = $link->getAttribute('href');
                
                $categoryTag = $xpath->query('.//following::li[@data-type="supertag"][1]//a[@class="tag__text"]', $link);
                $category = "Haber"; // Default category
                if ($categoryTag->length > 0) {
                    $category = trim($categoryTag->item(0)->getAttribute('title'));
                }
                
                if (strpos($url, 'http') !== 0) {
                    $url = $this->baseUrl . ltrim($url, '/');
                }
                
                $newsItems[] = [
                    'title' => trim($title),
                    'url' => $url,
                    'date' => $this->date,
                    'category' => $category
                ];
            }
            
            return $newsItems;
            
        } catch (Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }
}