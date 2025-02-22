// Genel değişkenler
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();
let calendar;

// Ana uygulama başlatma
function initializeApp() {
    try {
        initializeCalendar();
        setupYearSelector();
        initializeNewsBox();
        initializeWeatherBox();
        initializeCurrencyBox();
        initializeHolidaysBox();
        startPeriodicUpdates();
    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

// Periyodik güncellemeleri başlat
function startPeriodicUpdates() {
    // İlk yüklemeler
    fetchAndDisplayNews();
    updateWeather(document.getElementById('citySelect')?.value || 'ISTANBUL');
    updateExchangeRates();
    updateEventsToday();

    // Her 5 dakikada bir güncelle
    setInterval(() => {
        fetchAndDisplayNews();
        updateWeather(document.getElementById('citySelect')?.value || 'ISTANBUL');
        updateExchangeRates();
        updateEventsToday();
    }, 300000); // 5 dakika
}

// Tüm kutuları güncelleme
function updateAllBoxes(dateString, day, month, year) {
    const date = new Date(year, month - 1, day);
    fetchAndDisplayNews(date);
    updateExchangeRates();
    
    const citySelect = document.getElementById('citySelect');
    if (citySelect && citySelect.value) {
        updateWeather(citySelect.value);
    }

    // Wikipedia olaylarını getir
    fetchWikipediaEvents(day, month, year);
    
    // Tatilleri kontrol et ve göster
    const holiday = isHoliday(day, month, year);
    if (holiday) {
        updateEventsBox([`${holiday.name} - ${holiday.info}`]);
    }
}

// Yardımcı fonksiyonlar
function getMonthName(month) {
    const months = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    return months[month];
}

// DOM yüklendiğinde uygulamayı başlat
document.addEventListener('DOMContentLoaded', initializeApp);
// Takvim başlatma

function initializeCalendar() {
    const calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        locale: 'tr',
        firstDay: 1,
        events: function(info, successCallback) {
            const year = info.start.getFullYear();
            let events = [];

            // 1. Resmi tatilleri ekle
            if (officialHolidaysData[year]) {
                officialHolidaysData[year].forEach(holiday => {
                    const [day, month, year] = holiday.date.split('-');
                    events.push({
                        title: holiday.name,
                        start: `${year}-${month}-${day}`,
                        className: `holiday ${holiday.info.includes('Dini') ? 'religious' : 'national'}`,
                        extendedProps: {
                            type: 'holiday',
                            duration: holiday.duration,
                            info: holiday.info
                        }
                    });
                });
            }

            // 2. Yıllık özel günleri ekle
            specialDaysAndWeeks.annual.forEach(event => {
                if (event.date.type === 'dynamic') {
                    // Dinamik tarihli günler (Anneler/Babalar günü)
                    const dynamicDate = calculateDynamicDate(event.date.rule, year);
                    if (dynamicDate) {
                        events.push({
                            title: event.name,
                            start: dynamicDate,
                            className: `special-day ${event.category}`,
                            extendedProps: {
                                type: event.type,
                                info: event.info
                            }
                        });
                    }
                } else if (event.date.start && event.date.end) {
                    // Özel haftalar
                    const [startDay, startMonth] = event.date.start.split('-');
                    const [endDay, endMonth] = event.date.end.split('-');
                    events.push({
                        title: event.name,
                        start: `${year}-${startMonth}-${startDay}`,
                        end: `${year}-${endMonth}-${endDay}`,
                        display: 'background',
                        className: `special-week ${event.category}`,
                        extendedProps: {
                            type: event.type,
                            info: event.info
                        }
                    });
                } else {
                    // Normal özel günler
                    const [day, month] = event.date.split('-');
                    events.push({
                        title: event.name,
                        start: `${year}-${month}-${day}`,
                        className: `special-day ${event.category}`,
                        extendedProps: {
                            type: event.type,
                            info: event.info
                        }
                    });
                }
            });

            // 3. Yıla özel dini günleri ekle
            if (specialDaysAndWeeks[year]) {
                specialDaysAndWeeks[year].forEach(event => {
                    if (event.date.start && event.date.end) {
                        // Muharrem ayı gibi uzun süreli dini dönemler
                        const [startDay, startMonth, startYear] = event.date.start.split('-');
                        const [endDay, endMonth, endYear] = event.date.end.split('-');
                        events.push({
                            title: event.name,
                            start: `${startYear}-${startMonth}-${startDay}`,
                            end: `${endYear}-${endMonth}-${endDay}`,
                            display: 'background',
                            className: `religious-period ${event.category}`,
                            extendedProps: {
                                type: event.type,
                                info: event.info
                            }
                        });
                    } else {
                        // Kandil geceleri ve diğer dini günler
                        const [day, month, year] = event.date.split('-');
                        events.push({
                            title: event.name,
                            start: `${year}-${month}-${day}`,
                            className: `religious-day ${event.category}`,
                            extendedProps: {
                                type: event.type,
                                info: event.info
                            }
                        });
                    }
                });
            }

            successCallback(events);
        },
        eventDidMount: function(info) {
            // Tooltip oluştur
            const tooltip = document.createElement('div');
            tooltip.className = 'event-tooltip';
            tooltip.innerHTML = `
                <div class="tooltip-title">${info.event.title}</div>
                ${info.event.extendedProps.duration ? 
                    `<div class="tooltip-duration">${info.event.extendedProps.duration}</div>` : ''}
                <div class="tooltip-info">${info.event.extendedProps.info}</div>
            `;
            info.el.appendChild(tooltip);
        },
        dateClick: function(info) {
            fetchDayEvents(info.date);
        },
        datesSet: function(info) {
            const yearToShow = info.view.currentStart.getFullYear();
            displayYearHolidays(yearToShow);
            updateYearSelector(yearToShow);
        }
    });
    
    calendar.render();
    fetchDayEvents(new Date());
}

// Dinamik tarihleri hesaplama fonksiyonu
function calculateDynamicDate(rule, year) {
    const rules = {
        "Mayıs ayının ikinci Pazar günü": () => {
            let date = new Date(year, 4, 1);
            let sundayCount = 0;
            while (sundayCount < 2) {
                if (date.getDay() === 0) sundayCount++;
                if (sundayCount < 2) date.setDate(date.getDate() + 1);
            }
            return date.toISOString().split('T')[0];
        },
        "Haziran ayının üçüncü Pazar günü": () => {
            let date = new Date(year, 5, 1);
            let sundayCount = 0;
            while (sundayCount < 3) {
                if (date.getDay() === 0) sundayCount++;
                if (sundayCount < 3) date.setDate(date.getDate() + 1);
            }
            return date.toISOString().split('T')[0];
        }
    };
    return rules[rule] ? rules[rule]() : null;
}

// Yıl seçici ayarları
function setupYearSelector() {
    const yearSelector = document.getElementById('yearSelector');
    if (!yearSelector) return;

    // Mevcut yıldan 2 yıl öncesi ve 2 yıl sonrasını göster
    const currentYear = new Date().getFullYear();
    const years = Array.from({length: 5}, (_, i) => currentYear - 2 + i);
    
    yearSelector.innerHTML = ''; // Önceki seçenekleri temizle
    
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelector.appendChild(option);
    });
    
    yearSelector.value = currentYear;
    yearSelector.addEventListener('change', function(e) {
        const selectedYear = parseInt(e.target.value);
        calendar.gotoDate(`${selectedYear}-01-01`);
        displayYearHolidays(selectedYear);
    });
}

// Takvim hücre işlemleri
function handleDayCellMount(arg) {
    try {
        const date = arg.date;
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        
        const holiday = isHoliday(day, month, year);
        if (holiday) {
            arg.el.classList.add('holiday');
            if (holiday.duration.includes('Yarım')) {
                arg.el.classList.add('half-day');
            }
            if (holiday.name.includes('Arife')) {
                arg.el.classList.add('arife');
            }
            if (holiday.info.includes('Dini')) {
                arg.el.classList.add('religious');
            } else {
                arg.el.classList.add('national');
            }
            
            addHolidayTooltip(arg.el, holiday);
        }
    } catch (error) {
        console.error('Error in handleDayCellMount:', error);
    }
}

// Tooltip ekleme
function addHolidayTooltip(element, holiday) {
    const tooltip = document.createElement('div');
    tooltip.className = 'holiday-tooltip';
    tooltip.innerHTML = `
        <strong>${holiday.name}</strong><br>
        ${holiday.duration}<br>
        ${holiday.info}
    `;
    element.appendChild(tooltip);
}

// Tatil kontrolü
function isHoliday(day, month, year) {
    try {
        const formattedDate = `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;
        return officialHolidaysData[year]?.find(holiday => holiday.date === formattedDate);
    } catch (error) {
        console.error('Error checking holiday:', error);
        return null;
    }
}

// Yıl seçiciyi güncelle
function updateYearSelector(year) {
    const yearSelector = document.getElementById('yearSelector');
    if (!yearSelector) return;

    if (!Array.from(yearSelector.options).some(option => option.value === year.toString())) {
        const years = Array.from({length: 5}, (_, i) => year - 2 + i);
        yearSelector.innerHTML = '';
        years.forEach(y => {
            const option = document.createElement('option');
            option.value = y;
            option.textContent = y;
            yearSelector.appendChild(option);
        });
    }

    yearSelector.value = year.toString();
}
// Haber kutusu başlatma
function initializeNewsBox() {
    const newsBox = document.querySelector('.box-news');
    if (!newsBox) return;

    newsBox.innerHTML = `
        <h3>Son Dakika Haberler</h3>
        <div class="news-content">
            <div class="news-loading">
                <i class="fas fa-spinner fa-spin"></i>
                <span>Haberler yükleniyor...</span>
            </div>
        </div>
    `;

    fetchAndDisplayNews();
}

// Haberleri getir ve göster
function fetchAndDisplayNews(date = null) {
    const formattedDate = date ? formatDateForNews(date) : formatDateForNews(new Date());
    
    fetch(`get_news.php?date=${formattedDate}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(news => {
            if (news.error) {
                throw new Error(news.error);
            }
            updateNewsDisplay(news);
        })
        .catch(error => {
            console.error('Haber getirme hatası:', error);
            showNewsError(error.message);
        });
}

// Haberleri görüntüle

// Haberleri görüntüle
function updateNewsDisplay(news) {
    const newsContent = document.querySelector('.news-content');
    if (!newsContent) return;

    if (!Array.isArray(news) || news.length === 0) {
        showNewsError('Haber bulunamadı');
        return;
    }

    // Kategori renklerini tanımla
    const categoryColors = {
        'TÜRKİYE': '#e74c3c',
        'DÜNYA': '#3498db',
        'EKONOMİ': '#2ecc71',
        'SPOR': '#f39c12',
        'POLİTİKA': '#9b59b6',
        'Genel': '#95a5a6'
    };

    const newsHtml = `
        <div class="news-list">
            ${news.map(item => `
                <div class="news-item">
                    <div class="news-details">
                        <a href="${item.url}" target="_blank" class="news-title">
                            ${item.title}
                        </a>
                        <div class="news-meta">
                            <span class="news-category" style="color: ${categoryColors[item.category] || '#95a5a6'}">
                                ${item.category}
                            </span>
                            <span class="news-date">${formatDisplayDate(item.date)}</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    newsContent.innerHTML = newsHtml;

    // Haber kutusuna özel stil ekle
    const newsStyles = `

    `;

    // Stil ekle
    if (!document.getElementById('news-custom-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'news-custom-styles';
        styleSheet.textContent = newsStyles;
        document.head.appendChild(styleSheet);
    }
}

// Haber hatası göster
function showNewsError(message) {
    const newsContent = document.querySelector('.news-content');
    if (!newsContent) return;

    newsContent.innerHTML = `
        <div class="news-error">
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
            <button onclick="fetchAndDisplayNews()" class="retry-btn">
                <i class="fas fa-sync"></i> Yeniden Dene
            </button>
        </div>
    `;
}

// Tarih formatlama fonksiyonları
function formatDateForNews(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

function formatDisplayDate(dateStr) {
    if (!dateStr) return '';
    
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
}
// Tatil filtrelerini ayarla
function setupHolidayFilters() {
    const holidaysList = document.getElementById('holidaysList');
    if (!holidaysList) return;

    // Filtre butonlarını oluştur
    const filterDiv = document.createElement('div');
    filterDiv.className = 'holiday-filters';
    filterDiv.innerHTML = `
        <button class="filter-btn active" data-filter="all">Tümü</button>
        <button class="filter-btn" data-filter="religious">Dini</button>
        <button class="filter-btn" data-filter="national">Resmi</button>
        <button class="filter-btn" data-filter="upcoming">Yaklaşan</button>
    `;

    // Mevcut filtreleri temizle ve yenisini ekle
    const existingFilters = holidaysList.querySelector('.holiday-filters');
    if (existingFilters) {
        existingFilters.remove();
    }
    holidaysList.insertBefore(filterDiv, holidaysList.firstChild);

    // Filtreleme işlevi
    function filterHolidays(filterType) {
        const holidayItems = holidaysList.querySelectorAll('.holiday-item');
        holidayItems.forEach(item => {
            switch(filterType) {
                case 'all':
                    item.style.display = 'flex';
                    break;
                case 'religious':
                    item.style.display = item.classList.contains('religious') ? 'flex' : 'none';
                    break;
                case 'national':
                    item.style.display = item.classList.contains('national') ? 'flex' : 'none';
                    break;
                case 'upcoming':
                    const isPast = item.classList.contains('past');
                    item.style.display = !isPast ? 'flex' : 'none';
                    break;
            }
        });
    }

    // Filtre butonlarına tıklama olaylarını ekle
    const filterButtons = filterDiv.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Aktif butonu güncelle
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filtrelemeyi uygula
            filterHolidays(button.dataset.filter);
        });
    });

    // Başlangıçta tüm tatilleri göster
    filterHolidays('all');
}
// Bugünün olaylarını güncelle
function updateEventsToday() {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    // Wikipedia olaylarını getir
    fetchWikipediaEvents(day, month, year);
    
    // Bugün tatil mi kontrol et
    const formattedDate = `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;
    const holiday = officialHolidaysData[year]?.find(h => h.date === formattedDate);
    
    if (holiday) {
        updateEventsBox([`${holiday.name} - ${holiday.info}`]);
    }

    // Önemli olayları kontrol et
    const eventsBox = document.querySelector('.box-events');
    if (!eventsBox) return;

    const todayStr = `${day} ${getMonthName(month - 1)} ${year}`;
    eventsBox.querySelector('h3').textContent = `Bugünün Olayları (${todayStr})`;
}

// Wikipedia'dan günün olaylarını getir
function fetchWikipediaEvents(day, month, year) {
    const formattedDate = `${day}_${getMonthName(month - 1)}`;
    const apiUrl = `https://tr.wikipedia.org/w/api.php?action=parse&format=json&page=${formattedDate}&prop=text&section=1&origin=*`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.parse && data.parse.text) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(data.parse.text['*'], 'text/html');
                const events = Array.from(doc.querySelectorAll('li'))
                    .map(li => li.textContent.trim());
                
                // En fazla 10 olay göster
                updateEventsBox(events.slice(0, 10));
            }
        })
        .catch(error => {
            console.error('Error fetching events:', error);
            updateEventsBox(['Etkinlikler alınırken bir hata oluştu.']);
        });
}

// Olaylar kutusunu güncelle
function updateEventsBox(events) {
    const eventsBox = document.querySelector('.box-events');
    if (!eventsBox) return;

    const eventsContent = eventsBox.querySelector('.events-content') || document.createElement('div');
    eventsContent.className = 'events-content';

    if (events.length > 0) {
        eventsContent.innerHTML = `
            <ul class="events-list">
                ${events.map(event => `
                    <li>
                        <i class="fas fa-calendar-check"></i>
                        <span>${event}</span>
                    </li>
                `).join('')}
            </ul>
        `;
    } else {
        eventsContent.innerHTML = `
            <div class="no-events">
                <i class="fas fa-calendar-times"></i>
                <p>Bugün için kayıtlı olay bulunamadı.</p>
            </div>
        `;
    }

    // Mevcut içeriği temizle ve yenisini ekle
    const existingContent = eventsBox.querySelector('.events-content');
    if (existingContent) {
        existingContent.remove();
    }
    eventsBox.appendChild(eventsContent);
}
// Hava durumu kutusu başlatma
function initializeWeatherBox() {
    const weatherBox = document.querySelector('.box-weather');
    if (!weatherBox) return;

    weatherBox.innerHTML = `
        <h3>Hava Durumu</h3>
        <div class="weather-controls">
            <select id="citySelect" class="city-select">
                <option value="">İl Seçiniz</option>
            </select>
            <button id="locationBtn" class="location-btn">
                <i class="fas fa-location-arrow"></i>
                Konum
            </button>
        </div>
        <div class="weather-content">
            <div class="weather-loading">
                <i class="fas fa-cloud-sun"></i>
                <span>Lütfen bir il seçin</span>
            </div>
        </div>
    `;

    loadCities();
    setupWeatherEventListeners();
    
    const citySelect = document.getElementById('citySelect');
    citySelect.value = 'ISTANBUL';
    updateWeather('ISTANBUL');
}

// İlleri yükle
function loadCities() {
    const citySelect = document.getElementById('citySelect');
    if (!citySelect) return;

    Object.keys(citiesWithCoords).sort().forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
    });
}

// Event listener'ları ayarla
function setupWeatherEventListeners() {
    const citySelect = document.getElementById('citySelect');
    const locationBtn = document.getElementById('locationBtn');

    citySelect?.addEventListener('change', function() {
        const selectedCity = this.value;
        if (selectedCity) {
            updateWeather(selectedCity);
        }
    });

    locationBtn?.addEventListener('click', getUserLocation);
}

// Konum alma
function getUserLocation() {
    const locationBtn = document.getElementById('locationBtn');
    const citySelect = document.getElementById('citySelect');

    if (!navigator.geolocation) {
        alert('Tarayıcınız konum özelliğini desteklemiyor.');
        return;
    }

    locationBtn.disabled = true;
    locationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Konum Alınıyor...';

    navigator.geolocation.getCurrentPosition(
        // Başarılı
        (position) => {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;
            const nearestCity = findNearestCity(userLat, userLon);
            
            citySelect.value = nearestCity;
            updateWeather(nearestCity);

            locationBtn.innerHTML = '<i class="fas fa-check"></i> Konum Alındı';
            setTimeout(() => {
                locationBtn.disabled = false;
                locationBtn.innerHTML = '<i class="fas fa-location-arrow"></i> Konum';
            }, 2000);
        },
        // Hata
        (error) => {
            handleLocationError(error);
            locationBtn.disabled = false;
            locationBtn.innerHTML = '<i class="fas fa-location-arrow"></i> Konum';
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
    );
}

// En yakın şehri bul
function findNearestCity(userLat, userLon) {
    let nearestCity = 'ISTANBUL';
    let minDistance = Number.MAX_VALUE;

    Object.entries(citiesWithCoords).forEach(([city, coords]) => {
        const distance = calculateDistance(userLat, userLon, coords.lat, coords.lng);
        if (distance < minDistance) {
            minDistance = distance;
            nearestCity = city;
        }
    });

    return nearestCity;
}

// Hava durumu güncelleme
function updateWeather(city) {
    const weatherContent = document.querySelector('.weather-content');
    if (!weatherContent) return;

    weatherContent.innerHTML = `
        <div class="weather-loading">
            <i class="fas fa-spinner fa-spin"></i>
            <span>Hava durumu yükleniyor...</span>
        </div>
    `;

    fetch('get_weather.php?city=' + encodeURIComponent(city))
        .then(response => response.json())
        .then(data => {
            if (data.error) throw new Error(data.error.message || 'API error occurred');
            displayWeather(data, weatherContent);
        })
        .catch(error => {
            showWeatherError(error.message, weatherContent);
        });
}

// Hava durumu gösterimi
function displayWeather(data, container) {
    container.innerHTML = `
        <div class="weather-main">
            <div class="weather-icon">
                <img src="https:${data.current.condition.icon}" alt="${data.current.condition.text}">
            </div>
            <div class="weather-temp">
                <span class="temp">${Math.round(data.current.temp_c)}°C</span>
                <span class="condition">${data.current.condition.text}</span>
            </div>
        </div>
        <div class="weather-details">
            <div class="weather-detail">
                <i class="fas fa-temperature-high"></i>
                <span>Hissedilen: ${Math.round(data.current.feelslike_c)}°C</span>
            </div>
            <div class="weather-detail">
                <i class="fas fa-tint"></i>
                <span>Nem: %${data.current.humidity}</span>
            </div>
            <div class="weather-detail">
                <i class="fas fa-wind"></i>
                <span>Rüzgar: ${Math.round(data.current.wind_kph)} km/s</span>
            </div>
        </div>
        <div class="weather-update">
            <i class="fas fa-clock"></i>
            <span>Son güncelleme: ${new Date(data.current.last_updated).toLocaleTimeString()}</span>
        </div>
    `;
}

// Hata gösterimi
function showWeatherError(message, container) {
    container.innerHTML = `
        <div class="weather-error">
            <i class="fas fa-exclamation-circle"></i>
            <span>Hava durumu bilgisi alınamadı: ${message}</span>
        </div>
    `;
}

// Yardımcı fonksiyonlar
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Dünya'nın yarıçapı (km)
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function toRad(degrees) {
    return degrees * (Math.PI / 180);
}

function handleLocationError(error) {
    let message = 'Konum alınamadı: ';
    switch(error.code) {
        case error.PERMISSION_DENIED:
            message += 'Konum izni reddedildi.';
            break;
        case error.POSITION_UNAVAILABLE:
            message += 'Konum bilgisi alınamadı.';
            break;
        case error.TIMEOUT:
            message += 'Konum isteği zaman aşımına uğradı.';
            break;
        default:
            message += 'Bilinmeyen bir hata oluştu.';
    }
    alert(message);
}
// Döviz kuru kutusu başlatma
function initializeCurrencyBox() {
    const currencyBox = document.querySelector('.box-currency');
    if (!currencyBox) return;

    currencyBox.innerHTML = `
        <h3>Döviz Kuru</h3>
        <div class="current-rates">
            <div class="rate-item">
                <i class="fas fa-dollar-sign"></i>
                <span class="rate-label">1 USD =</span>
                <span class="rate-value" id="usdRate">Yükleniyor...</span>
            </div>
            <div class="rate-item">
                <i class="fas fa-euro-sign"></i>
                <span class="rate-label">1 EUR =</span>
                <span class="rate-value" id="eurRate">Yükleniyor...</span>
            </div>
        </div>
        <div class="currency-converter">
            <div class="converter-input">
                <input type="number" id="amount" value="1" min="0" step="any">
                <select id="fromCurrency">
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="TRY">TRY</option>
                </select>
            </div>
            <button id="swapCurrencies" class="swap-btn">
                <i class="fas fa-exchange-alt"></i>
            </button>
            <div class="converter-input">
                <input type="number" id="result" readonly>
                <select id="toCurrency">
                    <option value="TRY">TRY</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                </select>
            </div>
        </div>
    `;

    initializeCurrencyConverter();
}

// Döviz çevirici başlatma
function initializeCurrencyConverter() {
    const amount = document.getElementById('amount');
    const result = document.getElementById('result');
    const fromCurrency = document.getElementById('fromCurrency');
    const toCurrency = document.getElementById('toCurrency');
    const swapButton = document.getElementById('swapCurrencies');

    let rates = null;

    function fetchAndDisplayRates() {
        fetch('get_rates.php')
            .then(response => response.json())
            .then(data => {
                if (data.error) throw new Error(data.error);
                rates = data.conversion_rates;
                
                document.getElementById('usdRate').textContent = 
                    `${rates.TRY.toFixed(4)} TRY`;
                document.getElementById('eurRate').textContent = 
                    `${(rates.TRY / rates.EUR).toFixed(4)} TRY`;
                
                convertCurrency();
            })
            .catch(error => {
                handleCurrencyError(error);
            });
    }

    function convertCurrency() {
        if (!rates) return;

        const fromRate = rates[fromCurrency.value];
        const toRate = rates[toCurrency.value];
        const inputAmount = parseFloat(amount.value);

        if (!isNaN(inputAmount)) {
            const converted = (inputAmount * toRate) / fromRate;
            result.value = converted.toFixed(4);
        }
    }

    // Event listeners
    amount.addEventListener('input', convertCurrency);
    fromCurrency.addEventListener('change', convertCurrency);
    toCurrency.addEventListener('change', convertCurrency);
    
    swapButton.addEventListener('click', () => {
        const temp = fromCurrency.value;
        fromCurrency.value = toCurrency.value;
        toCurrency.value = temp;
        convertCurrency();
    });

    // İlk yükleme
    fetchAndDisplayRates();

    // Periyodik güncelleme
    setInterval(fetchAndDisplayRates, 300000);
}

// Kurları güncelleme
function updateExchangeRates() {
    const usdRate = document.getElementById('usdRate');
    const eurRate = document.getElementById('eurRate');
    
    if (!usdRate || !eurRate) return;

    fetch('get_rates.php')
        .then(response => response.json())
        .then(data => {
            if (data.error) throw new Error(data.error);
            
            usdRate.textContent = `${data.conversion_rates.TRY.toFixed(4)} TRY`;
            eurRate.textContent = `${(data.conversion_rates.TRY / data.conversion_rates.EUR).toFixed(4)} TRY`;
        })
        .catch(error => {
            handleCurrencyError(error);
        });
}

// Hata yönetimi
function handleCurrencyError(error) {
    console.error('Currency error:', error);
    
    const usdRate = document.getElementById('usdRate');
    const eurRate = document.getElementById('eurRate');
    
    if (usdRate) usdRate.textContent = 'Hata';
    if (eurRate) eurRate.textContent = 'Hata';
    
    const currencyBox = document.querySelector('.box-currency');
    if (currencyBox) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'currency-error';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>Döviz kurları alınamadı</span>
        `;
        
        const oldError = currencyBox.querySelector('.currency-error');
        if (oldError) oldError.remove();
        
        currencyBox.appendChild(errorDiv);
        
        setTimeout(() => errorDiv.remove(), 5000);
    }
}
// Tatil günleri kutusu başlatma
function initializeHolidaysBox() {
    const holidaysList = document.getElementById('holidaysList');
    if (!holidaysList) return;

    const currentYear = new Date().getFullYear();
    displayYearHolidays(currentYear);
    setupHolidayFilters();
}

// Tatil günleri görüntüleme
function displayYearHolidays(year) {
    const holidaysList = document.getElementById('holidaysList');
    if (!holidaysList) return;

    const holidays = officialHolidaysData[year] || [];
    
    if (holidays.length === 0) {
        showNoHolidays(holidaysList, year);
        return;
    }

    const sortedHolidays = sortHolidaysByDate(holidays);
    const filterControls = createFilterControls();
    const holidaysHTML = createHolidaysList(sortedHolidays);

    holidaysList.innerHTML = `
        ${filterControls}
        <div class="holidays-container">
            ${holidaysHTML}
        </div>
    `;

    addFilterEventListeners();
}

// Tatilleri tarihe göre sıralama
function sortHolidaysByDate(holidays) {
    return holidays.sort((a, b) => {
        const dateA = a.date.split('-').reverse().join('-');
        const dateB = b.date.split('-').reverse().join('-');
        return new Date(dateA) - new Date(dateB);
    });
}

// Filtre kontrolleri oluşturma
function createFilterControls() {
    return `
        <div class="holiday-filters">
            <button class="filter-btn active" data-filter="all">Tümü</button>
            <button class="filter-btn" data-filter="religious">Dini</button>
            <button class="filter-btn" data-filter="national">Resmi</button>
            <button class="filter-btn" data-filter="upcoming">Yaklaşan</button>
        </div>
    `;
}

// Tatil listesi oluşturma
function createHolidaysList(holidays) {
    return holidays.map(holiday => {
        const isReligious = holiday.info.toLowerCase().includes('dini');
        const iconClass = isReligious ? 'fas fa-moon' : 'fas fa-flag';
        const holidayType = isReligious ? 'religious' : 'national';
        const [day, month] = holiday.date.split('-');
        const formattedDate = `${day} ${getMonthName(parseInt(month) - 1)}`;
        const isPast = isHolidayPast(holiday.date);

        return `
            <div class="holiday-item ${holidayType} ${isPast ? 'past' : 'upcoming'}">
                <div class="holiday-date">
                    <i class="${iconClass}"></i>
                    ${formattedDate}
                </div>
                <div class="holiday-info">
                    <div class="holiday-name">${holiday.name}</div>
                    <div class="holiday-duration">${holiday.duration}</div>
                </div>
            </div>
        `;
    }).join('');
}

// Filtre olaylarını ekleme
function addFilterEventListeners() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const holidayItems = document.querySelectorAll('.holiday-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterType = button.dataset.filter;
            
            holidayItems.forEach(item => {
                switch(filterType) {
                    case 'all':
                        item.style.display = 'flex';
                        break;
                    case 'religious':
                        item.style.display = item.classList.contains('religious') ? 'flex' : 'none';
                        break;
                    case 'national':
                        item.style.display = item.classList.contains('national') ? 'flex' : 'none';
                        break;
                    case 'upcoming':
                        item.style.display = item.classList.contains('upcoming') ? 'flex' : 'none';
                        break;
                }
            });
        });
    });
}

// Gün olaylarını getirme ve güncelleme
function fetchDayEvents(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formattedDate = `${day} ${getMonthName(month - 1)} ${year}`;

    // Wikipedia olaylarını getir
    fetchWikipediaEvents(day, month, year);
    
    // Tatilleri kontrol et
    const holiday = isHoliday(day, month, year);
    if (holiday) {
        updateEventsBox([`${holiday.name} - ${holiday.info}`]);
    }

    // Tüm kutuları güncelle
    updateAllBoxes(formattedDate, day, month, year);
}

// Wikipedia olaylarını getir
function fetchWikipediaEvents(day, month, year) {
    const formattedDate = `${day}_${getMonthName(month - 1)}`;
    const apiUrl = `https://tr.wikipedia.org/w/api.php?action=parse&format=json&page=${formattedDate}&prop=text&section=1&origin=*`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.parse && data.parse.text) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(data.parse.text['*'], 'text/html');
                const events = Array.from(doc.querySelectorAll('li'))
                    .map(li => li.textContent.trim());
                
                updateEventsBox(events);
            }
        })
        .catch(error => {
            console.error('Error fetching events:', error);
            updateEventsBox(['Etkinlikler alınırken bir hata oluştu.']);
        });
}

// Olaylar kutusunu güncelle
function updateEventsBox(events) {
    const eventsBox = document.querySelector('.box-events');
    if (!eventsBox) return;

    eventsBox.innerHTML = `
        <h3>Bugünün Olayları</h3>
        <div class="events-content">
            ${events.length > 0 ? `
                <ul class="events-list">
                    ${events.slice(0, 10).map(event => `
                        <li>
                            <i class="fas fa-calendar-check"></i>
                            <span>${event}</span>
                        </li>
                    `).join('')}
                </ul>
            ` : `
                <div class="no-events">
                    <i class="fas fa-calendar-times"></i>
                    <p>Bugün için kayıtlı olay bulunamadı.</p>
                </div>
            `}
        </div>
    `;
}

// Yardımcı fonksiyonlar
function isHolidayPast(dateStr) {
    const [day, month, year] = dateStr.split('-');
    const holidayDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return holidayDate < today;
}

function showNoHolidays(container, year) {
    container.innerHTML = `
        <div class="no-holidays">
            <i class="fas fa-calendar-times"></i>
            <p>${year} yılı için tatil bilgisi bulunamadı.</p>
        </div>
    `;
}
// script.js içine eklenecek fonksiyonlar

function initializeAkaryakitBox() {
    const akaryakitBox = document.querySelector('.box-akaryakit');
    if (!akaryakitBox) return;

    akaryakitBox.innerHTML = `
        <h3>Akaryakıt Fiyatları</h3>
        <div class="city-selector">
            <select id="fuelCitySelect" class="city-select">
                <option value="ISTANBUL (AVRUPA)">İstanbul (Avrupa)</option>
            </select>
        </div>
        <div class="akaryakit-content">
            <div class="akaryakit-loading">
                <i class="fas fa-gas-pump fa-spin"></i>
                <span>Fiyatlar yükleniyor...</span>
            </div>
        </div>
    `;

    updateFuelPrices();
}

function updateFuelPrices(selectedCity = 'ISTANBUL (AVRUPA)') {
    const akaryakitContent = document.querySelector('.akaryakit-content');
    if (!akaryakitContent) return;

    fetch(`get_fuel_prices.php?city=${encodeURIComponent(selectedCity)}`)
        .then(response => response.json())
        .then(data => {
            if (!data.success) throw new Error(data.error);
            
            // Şehir listesini güncelle
            const citySelect = document.getElementById('fuelCitySelect');
            if (data.cities && citySelect.options.length === 1) {
                data.cities.forEach(city => {
                    const option = document.createElement('option');
                    option.value = city;
                    option.textContent = city.replace(/\(([^)]+)\)/, '($1)').toLowerCase()
                        .split(' ')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');
                    citySelect.appendChild(option);
                });
                citySelect.value = selectedCity;
            }

            akaryakitContent.innerHTML = `
                <div class="fuel-prices">
                    <div class="fuel-item">
                        <i class="fas fa-gas-pump"></i>
                        <div class="fuel-info">
                            <span class="fuel-type">Benzin</span>
                            <span class="fuel-price">${data.data.benzin} ₺/lt</span>
                        </div>
                    </div>
                    <div class="fuel-item">
                        <i class="fas fa-truck"></i>
                        <div class="fuel-info">
                            <span class="fuel-type">Motorin</span>
                            <span class="fuel-price">${data.data.motorin} ₺/lt</span>
                        </div>
                    </div>
                    <div class="fuel-item">
                        <i class="fas fa-fire"></i>
                        <div class="fuel-info">
                            <span class="fuel-type">LPG</span>
                            <span class="fuel-price">${data.data.lpg} ₺/lt</span>
                        </div>
                    </div>
                </div>
                <div class="fuel-update">
                    <i class="fas fa-clock"></i>
                    <span>Son güncelleme: ${new Date(data.lastUpdate).toLocaleString()}</span>
                </div>
            `;
        })
        .catch(error => {
            showFuelError(error.message);
        });
}

// Event listener'ları ekle
document.addEventListener('DOMContentLoaded', function() {
    const citySelect = document.getElementById('fuelCitySelect');
    if (citySelect) {
        citySelect.addEventListener('change', function() {
            updateFuelPrices(this.value);
        });
    }
});

// initializeApp fonksiyonuna eklenecek
function initializeApp() {
    try {
        initializeCalendar();
        setupYearSelector();
        initializeNewsBox();
        initializeWeatherBox();
        initializeCurrencyBox();
        initializeHolidaysBox();
        initializeAkaryakitBox(); // Yeni eklenen
        startPeriodicUpdates();
    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

// startPeriodicUpdates fonksiyonuna eklenecek
function startPeriodicUpdates() {
    // İlk yüklemeler
    fetchAndDisplayNews();
    updateWeather(document.getElementById('citySelect')?.value || 'ISTANBUL');
    updateExchangeRates();
    updateEventsToday();
    updateFuelPrices(); // Yeni eklenen

    // Her 5 dakikada bir güncelle
    setInterval(() => {
        fetchAndDisplayNews();
        updateWeather(document.getElementById('citySelect')?.value || 'ISTANBUL');
        updateExchangeRates();
        updateEventsToday();
        updateFuelPrices(); // Yeni eklenen
    }, 300000); // 5 dakika
}