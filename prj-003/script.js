/**
 * Cosmic Weather - Dashboard JavaScript
 * Uses Open-Meteo API (free, no key required)
 */

class WeatherDashboard {
    constructor() {
        this.currentLat = null;
        this.currentLon = null;
        this.chart = null;

        this.initElements();
        this.bindEvents();
        this.loadDefaultLocation();
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

        // Current weather elements
        this.weatherIcon = document.getElementById('weatherIcon');
        this.tempValue = document.getElementById('tempValue');
        this.locationName = document.getElementById('locationName');
        this.weatherDesc = document.getElementById('weatherDesc');
        this.weatherTime = document.getElementById('weatherTime');

        // Details
        this.windSpeed = document.getElementById('windSpeed');
        this.humidity = document.getElementById('humidity');
        this.feelsLike = document.getElementById('feelsLike');
        this.cloudCover = document.getElementById('cloudCover');

        // Forecast
        this.forecastGrid = document.getElementById('forecastGrid');
    }

    bindEvents() {
        this.searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.searchCity(this.cityInput.value);
        });

        this.locationBtn.addEventListener('click', () => this.getGeolocation());
        this.retryBtn.addEventListener('click', () => this.retry());
    }

    loadDefaultLocation() {
        // Try to get user's location, fallback to New York
        this.getGeolocation();
    }

    getGeolocation() {
        if (!navigator.geolocation) {
            this.fetchWeather(40.7128, -74.0060, 'New York'); // Default to NYC
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
            // Use Open-Meteo's geocoding API
            const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1`;
            const geoResponse = await fetch(geoUrl);
            const geoData = await geoResponse.json();

            if (!geoData.results || geoData.results.length === 0) {
                throw new Error('City not found');
            }

            const location = geoData.results[0];
            await this.fetchWeather(location.latitude, location.longitude, location.name);
        } catch (error) {
            this.showError(error.message);
        }
    }

    async fetchWeather(lat, lon, cityName = null) {
        this.showLoading();
        this.currentLat = lat;
        this.currentLon = lon;

        try {
            // Fetch current weather and forecast from Open-Meteo
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
                `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,cloud_cover,wind_speed_10m` +
                `&hourly=temperature_2m` +
                `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
                `&timezone=auto`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Weather data unavailable');
            }

            const data = await response.json();

            // If no city name, try reverse geocoding
            if (!cityName) {
                cityName = await this.reverseGeocode(lat, lon);
            }

            this.updateUI(data, cityName);
        } catch (error) {
            this.showError(error.message);
        }
    }

    async reverseGeocode(lat, lon) {
        try {
            const url = `https://geocoding-api.open-meteo.com/v1/search?name=&latitude=${lat}&longitude=${lon}`;
            // Open-Meteo doesn't have reverse geocoding, so use a fallback
            return `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
        } catch {
            return `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
        }
    }

    updateUI(data, cityName) {
        // Current weather
        const current = data.current;
        const weatherInfo = this.getWeatherInfo(current.weather_code);

        this.weatherIcon.textContent = weatherInfo.icon;
        this.tempValue.textContent = Math.round(current.temperature_2m);
        this.locationName.textContent = cityName;
        this.weatherDesc.textContent = weatherInfo.description;
        this.weatherTime.textContent = `Updated: ${new Date().toLocaleTimeString()}`;

        // Details
        this.windSpeed.textContent = `${current.wind_speed_10m} km/h`;
        this.humidity.textContent = `${current.relative_humidity_2m}%`;
        this.feelsLike.textContent = `${Math.round(current.apparent_temperature)}°C`;
        this.cloudCover.textContent = `${current.cloud_cover}%`;

        // 7-day forecast
        this.updateForecast(data.daily);

        // Hourly chart
        this.updateChart(data.hourly);

        this.showDashboard();
    }

    updateForecast(daily) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        this.forecastGrid.innerHTML = daily.time.map((date, i) => {
            const dayDate = new Date(date);
            const dayName = i === 0 ? 'Today' : days[dayDate.getDay()];
            const weather = this.getWeatherInfo(daily.weather_code[i]);

            return `
                <div class="forecast-card">
                    <span class="forecast-day">${dayName}</span>
                    <span class="forecast-icon">${weather.icon}</span>
                    <div class="forecast-temp">
                        <span class="temp-high">${Math.round(daily.temperature_2m_max[i])}°</span>
                        <span class="temp-low">${Math.round(daily.temperature_2m_min[i])}°</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateChart(hourly) {
        const canvas = document.getElementById('tempChart');
        const ctx = canvas.getContext('2d');

        // Get next 24 hours
        const temps = hourly.temperature_2m.slice(0, 24);
        const labels = hourly.time.slice(0, 24).map(t => {
            const date = new Date(t);
            return date.getHours() + ':00';
        });

        // Clear canvas
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = 200;

        // Draw chart
        this.drawChart(ctx, canvas.width, canvas.height, labels, temps);
    }

    drawChart(ctx, width, height, labels, data) {
        const padding = { top: 30, right: 20, bottom: 30, left: 40 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;

        const minTemp = Math.min(...data) - 2;
        const maxTemp = Math.max(...data) + 2;
        const tempRange = maxTemp - minTemp;

        const stepX = chartWidth / (data.length - 1);

        // Clear
        ctx.clearRect(0, 0, width, height);

        // Grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;

        for (let i = 0; i <= 4; i++) {
            const y = padding.top + (chartHeight / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(width - padding.right, y);
            ctx.stroke();
        }

        // Temperature line with gradient
        const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
        gradient.addColorStop(0, 'rgba(255, 149, 0, 0.8)');
        gradient.addColorStop(1, 'rgba(0, 245, 255, 0.8)');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();

        data.forEach((temp, i) => {
            const x = padding.left + i * stepX;
            const y = padding.top + chartHeight - ((temp - minTemp) / tempRange) * chartHeight;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();

        // Data points
        data.forEach((temp, i) => {
            const x = padding.left + i * stepX;
            const y = padding.top + chartHeight - ((temp - minTemp) / tempRange) * chartHeight;

            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#00f5ff';
            ctx.fill();
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.lineWidth = 1;
            ctx.stroke();
        });

        // Labels
        ctx.fillStyle = 'rgba(160, 160, 192, 0.8)';
        ctx.font = '10px Rajdhani';
        ctx.textAlign = 'center';

        // X-axis labels (every 4 hours)
        labels.forEach((label, i) => {
            if (i % 4 === 0) {
                const x = padding.left + i * stepX;
                ctx.fillText(label, x, height - 10);
            }
        });

        // Y-axis labels
        ctx.textAlign = 'right';
        for (let i = 0; i <= 4; i++) {
            const temp = minTemp + (tempRange / 4) * (4 - i);
            const y = padding.top + (chartHeight / 4) * i;
            ctx.fillText(Math.round(temp) + '°', padding.left - 8, y + 4);
        }
    }

    getWeatherInfo(code) {
        const weatherCodes = {
            0: { icon: '☀️', description: 'Clear sky' },
            1: { icon: '🌤️', description: 'Mainly clear' },
            2: { icon: '⛅', description: 'Partly cloudy' },
            3: { icon: '☁️', description: 'Overcast' },
            45: { icon: '🌫️', description: 'Foggy' },
            48: { icon: '🌫️', description: 'Depositing rime fog' },
            51: { icon: '🌧️', description: 'Light drizzle' },
            53: { icon: '🌧️', description: 'Moderate drizzle' },
            55: { icon: '🌧️', description: 'Dense drizzle' },
            61: { icon: '🌧️', description: 'Slight rain' },
            63: { icon: '🌧️', description: 'Moderate rain' },
            65: { icon: '🌧️', description: 'Heavy rain' },
            71: { icon: '🌨️', description: 'Slight snow' },
            73: { icon: '🌨️', description: 'Moderate snow' },
            75: { icon: '❄️', description: 'Heavy snow' },
            77: { icon: '🌨️', description: 'Snow grains' },
            80: { icon: '🌦️', description: 'Slight showers' },
            81: { icon: '🌦️', description: 'Moderate showers' },
            82: { icon: '⛈️', description: 'Violent showers' },
            85: { icon: '🌨️', description: 'Slight snow showers' },
            86: { icon: '🌨️', description: 'Heavy snow showers' },
            95: { icon: '⛈️', description: 'Thunderstorm' },
            96: { icon: '⛈️', description: 'Thunderstorm with hail' },
            99: { icon: '⛈️', description: 'Thunderstorm with heavy hail' }
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
            this.fetchWeather(this.currentLat, this.currentLon);
        } else {
            this.getGeolocation();
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new WeatherDashboard();
});

// Handle window resize for chart
window.addEventListener('resize', () => {
    const dashboard = document.getElementById('dashboard');
    if (dashboard.classList.contains('show')) {
        // Redraw chart on resize
        setTimeout(() => {
            const event = new Event('redraw');
            window.dispatchEvent(event);
        }, 100);
    }
});
