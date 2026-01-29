/**
 * Premium Weather Dashboard
 * Uses Open-Meteo API (free, no key required)
 */

class WeatherDashboard {
    constructor() {
        this.currentLat = null;
        this.currentLon = null;
        this.currentCity = null;
        this.weatherData = null;
        this.unit = localStorage.getItem('weather_unit') || 'C'; // C or F

        this.initElements();
        this.bindEvents();
        this.updateUnitToggleUI();
        this.loadFromCache() || this.getGeolocation();
    }

    initElements() {
        this.searchForm = document.getElementById('searchForm');
        this.cityInput = document.getElementById('cityInput');
        this.locationBtn = document.getElementById('locationBtn');
        this.loadingState = document.getElementById('loadingState');
        this.errorState = document.getElementById('errorState');
        this.errorMessage = document.getElementById('errorMessage');
        this.retryBtn = document.getElementById('retryBtn');
        this.dashboard = document.getElementById('dashboard');
        this.unitToggle = document.getElementById('unitToggle');

        // Hero elements
        this.weatherIcon = document.getElementById('weatherIcon');
        this.tempValue = document.getElementById('tempValue');
        this.locationName = document.getElementById('locationName');
        this.weatherDesc = document.getElementById('weatherDesc');
        this.tempHigh = document.getElementById('tempHigh');
        this.tempLow = document.getElementById('tempLow');

        // Stats
        this.windSpeed = document.getElementById('windSpeed');
        this.humidity = document.getElementById('humidity');
        this.feelsLike = document.getElementById('feelsLike');
        this.uvIndex = document.getElementById('uvIndex');
        this.aqiValue = document.getElementById('aqiValue');
        this.aqiStat = document.querySelector('.aqi-stat');
        this.visibility = document.getElementById('visibility');

        // Forecasts
        this.hourlyScroll = document.getElementById('hourlyScroll');
        this.forecastList = document.getElementById('forecastList');
    }

    bindEvents() {
        this.searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.searchCity(this.cityInput.value);
        });

        this.locationBtn.addEventListener('click', () => this.getGeolocation());
        this.retryBtn.addEventListener('click', () => this.retry());

        // Unit toggle
        this.unitToggle.addEventListener('click', () => this.toggleUnit());

        // Scroll indicator
        this.dashboardLeft = document.getElementById('dashboardLeft');
        this.scrollIndicator = document.getElementById('scrollIndicator');

        if (this.dashboardLeft && this.scrollIndicator) {
            // Hide indicator when scrolled
            this.dashboardLeft.addEventListener('scroll', () => {
                const { scrollTop, scrollHeight, clientHeight } = this.dashboardLeft;
                const isNearBottom = scrollTop + clientHeight >= scrollHeight - 50;
                this.scrollIndicator.classList.toggle('hidden', isNearBottom);
            });

            // Click to scroll down
            this.scrollIndicator.addEventListener('click', () => {
                this.dashboardLeft.scrollBy({ top: 200, behavior: 'smooth' });
            });
        }
    }

    toggleUnit() {
        this.unit = this.unit === 'C' ? 'F' : 'C';
        localStorage.setItem('weather_unit', this.unit);
        this.updateUnitToggleUI();

        // Re-render with current data if available
        if (this.weatherData && this.currentCity) {
            this.updateUI(this.weatherData, this.currentCity);
        }
    }

    updateUnitToggleUI() {
        const options = this.unitToggle.querySelectorAll('.unit-option');
        options.forEach(opt => {
            opt.classList.toggle('active', opt.dataset.unit === this.unit);
        });
    }

    // Convert Celsius to Fahrenheit
    toDisplayTemp(celsius) {
        if (this.unit === 'F') {
            return Math.round((celsius * 9 / 5) + 32);
        }
        return Math.round(celsius);
    }

    // LocalStorage caching
    loadFromCache() {
        try {
            const cached = localStorage.getItem('weather_cache');
            if (!cached) return false;

            const { lat, lon, city, timestamp } = JSON.parse(cached);
            const age = Date.now() - timestamp;

            // Cache valid for 10 minutes
            if (age < 10 * 60 * 1000) {
                this.fetchWeather(lat, lon, city);
                return true;
            }
        } catch (e) { }
        return false;
    }

    saveToCache(lat, lon, city) {
        try {
            localStorage.setItem('weather_cache', JSON.stringify({
                lat, lon, city, timestamp: Date.now()
            }));
        } catch (e) { }
    }

    getGeolocation() {
        if (!navigator.geolocation) {
            this.fetchWeather(40.7128, -74.0060, 'New York');
            return;
        }

        this.showLoading();

        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.fetchWeather(
                    position.coords.latitude,
                    position.coords.longitude
                );
            },
            (error) => {
                console.warn('Geolocation failed:', error);
                this.fetchWeather(40.7128, -74.0060, 'New York');
            },
            { timeout: 10000 }
        );
    }

    async searchCity(query) {
        if (!query.trim()) return;

        this.showLoading();

        try {
            const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1`;
            const geoResponse = await fetch(geoUrl);
            const geoData = await geoResponse.json();

            if (!geoData.results || geoData.results.length === 0) {
                throw new Error('City not found');
            }

            const location = geoData.results[0];
            const displayName = location.country
                ? `${location.name}, ${location.country}`
                : location.name;
            await this.fetchWeather(location.latitude, location.longitude, displayName);
        } catch (error) {
            this.showError(error.message);
        }
    }

    async fetchWeather(lat, lon, cityName = null) {
        this.showLoading();
        this.currentLat = lat;
        this.currentLon = lon;

        try {
            // Weather API URL
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
                `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,uv_index,is_day,visibility` +
                `&hourly=temperature_2m,weather_code` +
                `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
                `&timezone=auto`;

            // Air Quality API URL
            const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}` +
                `&current=us_aqi,pm10,pm2_5` +
                `&timezone=auto`;

            // Fetch both in parallel
            const [weatherResponse, aqiResponse] = await Promise.all([
                fetch(weatherUrl),
                fetch(aqiUrl)
            ]);

            if (!weatherResponse.ok) {
                throw new Error('Weather data unavailable');
            }

            const weatherData = await weatherResponse.json();
            let aqiData = null;

            if (aqiResponse.ok) {
                aqiData = await aqiResponse.json();
            }

            if (!cityName) {
                cityName = await this.reverseGeocode(lat, lon);
            }

            this.currentCity = cityName;
            this.weatherData = weatherData;
            this.aqiData = aqiData;
            this.saveToCache(lat, lon, cityName);
            this.updateUI(weatherData, cityName, aqiData);
        } catch (error) {
            this.showError(error.message);
        }
    }

    async reverseGeocode(lat, lon) {
        try {
            const url = `https://geocoding-api.open-meteo.com/v1/search?name=city&latitude=${lat}&longitude=${lon}&count=1`;
            return `${lat.toFixed(1)}°, ${lon.toFixed(1)}°`;
        } catch {
            return `${lat.toFixed(1)}°, ${lon.toFixed(1)}°`;
        }
    }

    updateUI(data, cityName, aqiData = null) {
        const current = data.current;
        const daily = data.daily;
        const hourly = data.hourly;
        const isDay = current.is_day === 1;
        const weatherInfo = this.getWeatherInfo(current.weather_code);

        // Update background based on weather
        this.updateBackground(current.weather_code, isDay);

        // Hero section
        this.weatherIcon.textContent = weatherInfo.icon;
        this.animateTemperature(this.toDisplayTemp(current.temperature_2m));
        this.locationName.textContent = cityName;
        this.weatherDesc.textContent = weatherInfo.description;
        this.tempHigh.textContent = this.toDisplayTemp(daily.temperature_2m_max[0]);
        this.tempLow.textContent = this.toDisplayTemp(daily.temperature_2m_min[0]);

        // Stats
        this.windSpeed.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
        this.humidity.textContent = `${current.relative_humidity_2m}%`;
        this.feelsLike.textContent = `${this.toDisplayTemp(current.apparent_temperature)}°`;
        this.uvIndex.textContent = current.uv_index ? Math.round(current.uv_index) : '0';

        // Visibility (convert from meters to km)
        const visibilityKm = current.visibility ? Math.round(current.visibility / 1000) : '--';
        this.visibility.textContent = visibilityKm !== '--' ? `${visibilityKm} km` : '--';

        // AQI
        if (aqiData && aqiData.current) {
            const aqi = Math.round(aqiData.current.us_aqi);
            this.aqiValue.textContent = aqi;
            this.updateAqiColor(aqi);
        } else {
            this.aqiValue.textContent = '--';
            this.aqiStat.className = 'stat-item aqi-stat';
        }

        // Hourly forecast
        this.updateHourlyForecast(hourly);

        // 7-day forecast
        this.updateDailyForecast(daily);

        this.showDashboard();
    }

    animateTemperature(temp) {
        let current = 0;
        const duration = 1000;
        const step = temp / (duration / 16);

        const animate = () => {
            current += step;
            if (current < temp) {
                this.tempValue.textContent = Math.round(current);
                requestAnimationFrame(animate);
            } else {
                this.tempValue.textContent = temp;
            }
        };
        animate();
    }

    updateAqiColor(aqi) {
        // Remove all AQI classes
        this.aqiStat.classList.remove(
            'aqi-good', 'aqi-moderate', 'aqi-unhealthy-sensitive',
            'aqi-unhealthy', 'aqi-very-unhealthy', 'aqi-hazardous'
        );

        // Apply appropriate class based on US EPA AQI ranges
        if (aqi <= 50) {
            this.aqiStat.classList.add('aqi-good');
        } else if (aqi <= 100) {
            this.aqiStat.classList.add('aqi-moderate');
        } else if (aqi <= 150) {
            this.aqiStat.classList.add('aqi-unhealthy-sensitive');
        } else if (aqi <= 200) {
            this.aqiStat.classList.add('aqi-unhealthy');
        } else if (aqi <= 300) {
            this.aqiStat.classList.add('aqi-very-unhealthy');
        } else {
            this.aqiStat.classList.add('aqi-hazardous');
        }
    }

    updateBackground(code, isDay) {
        const body = document.body;
        body.classList.remove('weather-clear', 'weather-cloudy', 'weather-rainy', 'weather-night', 'weather-sunset');

        if (!isDay) {
            body.classList.add('weather-night');
            return;
        }

        // Check time for sunset gradient (6-8 PM would be sunset)
        const hour = new Date().getHours();
        if (hour >= 17 && hour <= 19) {
            body.classList.add('weather-sunset');
            return;
        }

        if (code === 0 || code === 1) {
            body.classList.add('weather-clear');
        } else if (code >= 2 && code <= 48) {
            body.classList.add('weather-cloudy');
        } else {
            body.classList.add('weather-rainy');
        }
    }

    updateHourlyForecast(hourly) {
        const now = new Date();
        const currentHour = now.getHours();

        let html = '';
        for (let i = 0; i < 12; i++) {
            const hourIndex = currentHour + i;
            if (hourIndex >= hourly.time.length) break;

            const time = new Date(hourly.time[hourIndex]);
            const timeStr = i === 0 ? 'Now' : time.toLocaleTimeString('en-US', { hour: 'numeric' });
            const temp = this.toDisplayTemp(hourly.temperature_2m[hourIndex]);
            const weather = this.getWeatherInfo(hourly.weather_code[hourIndex]);

            html += `
                <div class="hourly-item ${i === 0 ? 'now' : ''}">
                    <span class="hourly-time">${timeStr}</span>
                    <span class="hourly-icon">${weather.icon}</span>
                    <span class="hourly-temp">${temp}°</span>
                </div>
            `;
        }

        this.hourlyScroll.innerHTML = html;
    }

    updateDailyForecast(daily) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        let html = '';
        for (let i = 0; i < Math.min(7, daily.time.length); i++) {
            const date = new Date(daily.time[i]);
            const dayName = i === 0 ? 'Today' : days[date.getDay()];
            const weather = this.getWeatherInfo(daily.weather_code[i]);
            const high = this.toDisplayTemp(daily.temperature_2m_max[i]);
            const low = this.toDisplayTemp(daily.temperature_2m_min[i]);

            html += `
                <div class="forecast-item">
                    <span class="forecast-day">${dayName}</span>
                    <span class="forecast-icon">${weather.icon}</span>
                    <span class="forecast-condition">${weather.description}</span>
                    <div class="forecast-temps">
                        <span class="forecast-high">${high}°</span>
                        <span class="forecast-low">${low}°</span>
                    </div>
                </div>
            `;
        }

        this.forecastList.innerHTML = html;
    }

    getWeatherInfo(code) {
        const weatherCodes = {
            0: { icon: '☀️', description: 'Clear sky' },
            1: { icon: '🌤️', description: 'Mainly clear' },
            2: { icon: '⛅', description: 'Partly cloudy' },
            3: { icon: '☁️', description: 'Overcast' },
            45: { icon: '🌫️', description: 'Foggy' },
            48: { icon: '🌫️', description: 'Rime fog' },
            51: { icon: '🌧️', description: 'Light drizzle' },
            53: { icon: '🌧️', description: 'Drizzle' },
            55: { icon: '🌧️', description: 'Dense drizzle' },
            61: { icon: '🌧️', description: 'Light rain' },
            63: { icon: '🌧️', description: 'Rain' },
            65: { icon: '🌧️', description: 'Heavy rain' },
            71: { icon: '🌨️', description: 'Light snow' },
            73: { icon: '🌨️', description: 'Snow' },
            75: { icon: '❄️', description: 'Heavy snow' },
            77: { icon: '🌨️', description: 'Snow grains' },
            80: { icon: '🌦️', description: 'Light showers' },
            81: { icon: '🌦️', description: 'Showers' },
            82: { icon: '⛈️', description: 'Heavy showers' },
            85: { icon: '🌨️', description: 'Snow showers' },
            86: { icon: '🌨️', description: 'Heavy snow showers' },
            95: { icon: '⛈️', description: 'Thunderstorm' },
            96: { icon: '⛈️', description: 'Thunderstorm with hail' },
            99: { icon: '⛈️', description: 'Severe thunderstorm' }
        };

        return weatherCodes[code] || { icon: '🌡️', description: 'Unknown' };
    }

    showLoading() {
        this.loadingState.classList.add('show');
        this.errorState.classList.remove('show');
        this.dashboard.classList.remove('show');
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorState.classList.add('show');
        this.loadingState.classList.remove('show');
        this.dashboard.classList.remove('show');
    }

    showDashboard() {
        this.dashboard.classList.add('show');
        this.loadingState.classList.remove('show');
        this.errorState.classList.remove('show');
    }

    retry() {
        if (this.currentLat && this.currentLon) {
            this.fetchWeather(this.currentLat, this.currentLon, this.currentCity);
        } else {
            this.getGeolocation();
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new WeatherDashboard();
});
