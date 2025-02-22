<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern Takvim Dashboard</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fullcalendar@5.11.3/main.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <link rel="stylesheet" href="style.css">



</head>
<body>
    <div class="container">
        <!-- Takvim -->
        <div class="box box-calendar">
            <h3>Modern Takvim</h3>
            <div class="calendar-controls">
                <select id="yearSelector" class="year-selector"></select>
            </div>
            <div id="calendar" class="calendar"></div>
        </div>

        <!-- Haberler -->
        <div class="box-euronews">
            <h3>Günün Haberleri</h3>
            <div class="news-content">
                <div class="news-loading">
                    <i class="fas fa-spinner fa-spin"></i>
                    <span>Haberler yükleniyor...</span>
                </div>
            </div>
        </div>

        <!-- Bugünün Olayları -->
        <div class="box box-events">
            <h3>Günün Olayları</h3>
            <div class="events-content"></div>
        </div>

        <!-- Döviz Kuru -->
        <div class="box box-currency">
            <h3>Döviz Kuru</h3>
            <div class="currency-content"></div>
        </div>

        <!-- Hava Durumu -->
        <div class="box box-weather">
            <h3>Hava Durumu</h3>
            <div class="weather-content"></div>
        </div>

        <!-- Tatil Günleri -->
        <div class="box box-holidays">
            <h3>Tatil Günleri</h3>
            <div id="holidaysList"></div>
        </div>

                <!-- Akaryakıt Fiyatları -->
                <div class="box box-akaryakit">
            <h3>Akaryakıt Fiyatları</h3>
            <div id="akaryakit"></div>
        </div>
    </div>
    </div>

    <div class="footer">© 2025 Modern Dashboard. Tüm hakları saklıdır.</div>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/fullcalendar@5.11.3/main.min.js"></script>
    <script src="holiday-data.js"></script>
    <script src="cities-data.js"></script>

    <script src="script.js"></script>
</body>
</html>