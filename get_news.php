<?php
header('Content-Type: application/json');
require_once 'haber.php';

$date = isset($_GET['date']) ? $_GET['date'] : date('Ymd');
$scraper = new NewsScraperByDate($date);
$news = $scraper->fetchNews();

echo json_encode($news);
?>