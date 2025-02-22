<!DOCTYPE html>
<html>
<head>
    <title>Türkiye İlleri Hava Durumu</title>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background-color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .city-select {
            width: 100%;
            padding: 10px;
            margin-bottom: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
        }
        .weather-card {
            border: 1px solid #ddd;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
            background-color: #fff;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            display: none;
        }
        .weather-info {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-top: 15px;
        }
        .weather-info p {
            margin: 5px 0;
            padding: 10px;
            background-color: #f8f9fa;
            border-radius: 5px;
        }
        .loading {
            display: none;
            text-align: center;
            margin: 20px 0;
        }
        .location-btn {
            background-color: #4CAF50;
            border: none;
            color: white;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            display: block;
            width: 100%;
            font-size: 16px;
            margin-bottom: 10px;
            cursor: pointer;
            border-radius: 5px;
            transition: background-color 0.3s;
        }
        .location-btn:hover {
            background-color: #45a049;
        }
        .location-btn:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Türkiye İlleri Hava Durumu</h2>
        <select id="citySelect" class="city-select">
            <option value="ANTALYA">ANTALYA</option>
        </select>

        <div class="loading">Yükleniyor...</div>

        <div id="weatherCard" class="weather-card">
            <h2 id="cityName"></h2>
            <div class="weather-info">
                <p><strong>Sıcaklık:</strong> <span id="temp"></span>°C</p>
                <p><strong>Hissedilen:</strong> <span id="feelslike"></span>°C</p>
                <p><strong>Nem:</strong> <span id="humidity"></span>%</p>
                <p><strong>Rüzgar Hızı:</strong> <span id="wind"></span> km/s</p>
                <p><strong>Durum:</strong> <span id="condition"></span></p>
                <p><strong>Son Güncelleme:</strong> <span id="lastUpdate"></span></p>
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <img id="weatherIcon" alt="Hava durumu ikonu">
            </div>
        </div>
    </div>
    <script src="get_weather.js"></script>
    <script src="holidays.js"></script>
    <script src="script.js"></script>
</body>
</html>