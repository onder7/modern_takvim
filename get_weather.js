// Türkiye illeri ve koordinatları
const citiesWithCoords = {
    'ADANA': { lat: 37.0000, lng: 35.3213 },
    'ADIYAMAN': { lat: 37.7648, lng: 38.2786 },
    'AFYONKARAHISAR': { lat: 38.7507, lng: 30.5567 },
    'AGRI': { lat: 39.7191, lng: 43.0503 },
    'AMASYA': { lat: 40.6499, lng: 35.8353 },
    'ANKARA': { lat: 39.9334, lng: 32.8597 },
    'ANTALYA': { lat: 36.8841, lng: 30.7056 },
    'ARTVIN': { lat: 41.1828, lng: 41.8183 },
    'AYDIN': { lat: 37.8560, lng: 27.8416 },
    'BALIKESIR': { lat: 39.6484, lng: 27.8826 },
    'BILECIK': { lat: 40.1451, lng: 29.9798 },
    'BINGOL': { lat: 38.8855, lng: 40.4966 },
    'BITLIS': { lat: 38.4006, lng: 42.1095 },
    'BOLU': { lat: 40.7391, lng: 31.6113 },
    'BURDUR': { lat: 37.7205, lng: 30.2908 },
    'BURSA': { lat: 40.1885, lng: 29.0610 },
    'CANAKKALE': { lat: 40.1553, lng: 26.4142 },
    'CANKIRI': { lat: 40.6013, lng: 33.6134 },
    'CORUM': { lat: 40.5499, lng: 34.9537 },
    'DENIZLI': { lat: 37.7830, lng: 29.0963 },
    'DIYARBAKIR': { lat: 37.9144, lng: 40.2306 },
    'EDIRNE': { lat: 41.6818, lng: 26.5623 },
    'ELAZIG': { lat: 38.6810, lng: 39.2264 },
    'ERZINCAN': { lat: 39.7500, lng: 39.5000 },
    'ERZURUM': { lat: 39.9000, lng: 41.2700 },
    'ESKISEHIR': { lat: 39.7767, lng: 30.5206 },
    'GAZIANTEP': { lat: 37.0662, lng: 37.3833 },
    'GIRESUN': { lat: 40.9128, lng: 38.3895 },
    'GUMUSHANE': { lat: 40.4603, lng: 39.4814 },
    'HAKKARI': { lat: 37.5744, lng: 43.7408 },
    'HATAY': { lat: 36.4018, lng: 36.3498 },
    'ISPARTA': { lat: 37.7648, lng: 30.5566 },
    'MERSIN': { lat: 36.8000, lng: 34.6333 },
    'ISTANBUL': { lat: 41.0082, lng: 28.9784 },
    'IZMIR': { lat: 38.4189, lng: 27.1287 },
    'KARS': { lat: 40.6013, lng: 43.0975 },
    'KASTAMONU': { lat: 41.3887, lng: 33.7827 },
    'KAYSERI': { lat: 38.7205, lng: 35.4826 },
    'KIRKLARELI': { lat: 41.7333, lng: 27.2167 },
    'KIRSEHIR': { lat: 39.1425, lng: 34.1709 },
    'KOCAELI': { lat: 40.8533, lng: 29.8815 },
    'KONYA': { lat: 37.8667, lng: 32.4833 },
    'KUTAHYA': { lat: 39.4167, lng: 29.9833 },
    'MALATYA': { lat: 38.3552, lng: 38.3095 },
    'MANISA': { lat: 38.6191, lng: 27.4289 },
    'KAHRAMANMARAS': { lat: 37.5858, lng: 36.9371 },
    'MARDIN': { lat: 37.3212, lng: 40.7245 },
    'MUGLA': { lat: 37.2153, lng: 28.3636 },
    'MUS': { lat: 38.7432, lng: 41.5064 },
    'NEVSEHIR': { lat: 38.6242, lng: 34.7239 },
    'NIGDE': { lat: 37.9667, lng: 34.6833 },
    'ORDU': { lat: 40.9839, lng: 37.8764 },
    'RIZE': { lat: 41.0201, lng: 40.5234 },
    'SAKARYA': { lat: 40.7569, lng: 30.3781 },
    'SAMSUN': { lat: 41.2928, lng: 36.3313 },
    'SIIRT': { lat: 37.9333, lng: 41.9500 },
    'SINOP': { lat: 42.0231, lng: 35.1531 },
    'SIVAS': { lat: 39.7477, lng: 37.0179 },
    'TEKIRDAG': { lat: 40.9833, lng: 27.5167 },
    'TOKAT': { lat: 40.3167, lng: 36.5500 },
    'TRABZON': { lat: 41.0015, lng: 39.7178 },
    'TUNCELI': { lat: 39.1079, lng: 39.5401 },
    'SANLIURFA': { lat: 37.1591, lng: 38.7969 },
    'USAK': { lat: 38.6823, lng: 29.4082 },
    'VAN': { lat: 38.4891, lng: 43.4089 },
    'YOZGAT': { lat: 39.8181, lng: 34.8147 },
    'ZONGULDAK': { lat: 41.4564, lng: 31.7987 },
    'AKSARAY': { lat: 38.3687, lng: 34.0370 },
    'BAYBURT': { lat: 40.2552, lng: 40.2249 },
    'KARAMAN': { lat: 37.1759, lng: 33.2287 },
    'KIRIKKALE': { lat: 39.8468, lng: 33.5153 },
    'BATMAN': { lat: 37.8812, lng: 41.1351 },
    'SIRNAK': { lat: 37.5164, lng: 42.4611 },
    'BARTIN': { lat: 41.6344, lng: 32.3375 },
    'ARDAHAN': { lat: 41.1105, lng: 42.7022 },
    'IGDIR': { lat: 39.9167, lng: 44.0333 },
    'YALOVA': { lat: 40.6500, lng: 29.2667 },
    'KARABUK': { lat: 41.2061, lng: 32.6204 },
    'KILIS': { lat: 36.7184, lng: 37.1212 },
    'OSMANIYE': { lat: 37.0742, lng: 36.2472 },
    'DUZCE': { lat: 40.8438, lng: 31.1565 }
};

// İki nokta arasındaki mesafeyi hesapla (Haversine formülü)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Dünya'nın yarıçapı (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// En yakın şehri bul
function findNearestCity(userLat, userLng) {
    let nearestCity = 'ISTANBUL'; // Varsayılan şehir
    let minDistance = Number.MAX_VALUE;

    for (const [city, coords] of Object.entries(citiesWithCoords)) {
        const distance = calculateDistance(userLat, userLng, coords.lat, coords.lng);
        if (distance < minDistance) {
            minDistance = distance;
            nearestCity = city;
        }
    }
    return nearestCity;
}

// Hava durumu verilerini getir
function getWeatherData(city) {
    const loading = document.querySelector('.loading');
    const weatherCard = document.getElementById('weatherCard');
    
    loading.style.display = 'block';
    weatherCard.style.display = 'none';

    fetch('get_weather.php?city=' + encodeURIComponent(city))
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text().then(text => {
                try {
                    return JSON.parse(text);
                } catch (e) {
                    console.error('Raw response:', text);
                    throw new Error('Invalid JSON response from server');
                }
            });
        })
        .then(data => {
            if (data.error) {
                throw new Error(data.error.message || 'API error occurred');
            }

// Verileri göster
// document.getElementById('cityName').textContent = data.location.name + ' Hava Durumu';
            document.getElementById('temp').textContent = data.current.temp_c;
            document.getElementById('feelslike').textContent = data.current.feelslike_c;
            document.getElementById('humidity').textContent = data.current.humidity;
            document.getElementById('wind').textContent = data.current.wind_kph;
            document.getElementById('condition').textContent = data.current.condition.text;
            document.getElementById('lastUpdate').textContent = new Date(data.current.last_updated).toLocaleTimeString();
            document.getElementById('weatherIcon').src = 'https:' + data.current.condition.icon;
            
            weatherCard.style.display = 'block';
        })
        .catch(error => {
            console.error('Error details:', error);
            alert('Hava durumu bilgisi alınamadı: ' + error.message);
            weatherCard.style.display = 'none';
        })
        .finally(() => {
            loading.style.display = 'none';
        });
}

// Kullanıcının konumunu al
function getUserLocation() {
    if ("geolocation" in navigator) {
        const locationButton = document.createElement('button');
        locationButton.textContent = "Konumumu Kullan";
        locationButton.className = "location-btn";

        // Butonu select box'ın üstüne ekle
        const selectBox = document.getElementById('citySelect');
        selectBox.parentNode.insertBefore(locationButton, selectBox);

        locationButton.addEventListener('click', () => {
            locationButton.disabled = true;
            locationButton.textContent = "Konum Alınıyor...";

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;
                    const nearestCity = findNearestCity(userLat, userLng);
                    
                    // Select box'ta şehri seç
                    citySelect.value = nearestCity;
                    
                    // Hava durumunu getir
                    getWeatherData(nearestCity);

                    locationButton.textContent = "Konum Kullanıldı";
                    setTimeout(() => {
                        locationButton.textContent = "Konumumu Kullan";
                        locationButton.disabled = false;
                    }, 3000);
                },
                (error) => {
                    let errorMessage;
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = "Konum izni reddedildi.";
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = "Konum bilgisi alınamadı.";
                            break;
                        case error.TIMEOUT:
                            errorMessage = "Konum isteği zaman aşımına uğradı.";
                            break;
                        default:
                            errorMessage = "Bilinmeyen bir hata oluştu.";
                    }
                    alert(errorMessage);
                    locationButton.textContent = "Konumumu Kullan";
                    locationButton.disabled = false;
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
        });
    }
}

// Şehir listesini doldur
const citySelect = document.getElementById('citySelect');
citySelect.innerHTML = '';
const istanbulOption = document.createElement('option');
istanbulOption.value = 'ISTANBUL';
istanbulOption.textContent = 'ISTANBUL';

citySelect.appendChild(istanbulOption);
Object.keys(citiesWithCoords)
    .filter(city => city !== 'ISTANBUL') // İstanbul'u filtrele çünkü zaten ekledik
    .sort() // Alfabetik sırala
    .forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
    });

// Şehir seçildiğinde hava durumunu getir
citySelect.addEventListener('change', function() {
    const selectedCity = this.value;
    if (selectedCity) {
        getWeatherData(selectedCity);
    } else {
        document.getElementById('weatherCard').style.display = 'none';
    }
});

// Sayfa yüklendiğinde çalışacak fonksiyonlar
window.addEventListener('DOMContentLoaded', function() {
    // Konum özelliğini ekle
    getUserLocation();
    
    // İstanbul'u varsayılan olarak seç ve hava durumunu getir
    const defaultCity = 'ISTANBUL';
    citySelect.value = defaultCity;
    getWeatherData(defaultCity);
});
