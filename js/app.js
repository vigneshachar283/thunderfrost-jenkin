class ThunderfrostWeather {
  constructor() {
    console.log("Thunderfrost Weather App Initialized");
  }

  convertTemperature(temp) {
    return Math.round(temp);
  }

  getUnitSymbol() {
    return "°C";
  }

  getCountryName(countryCode) {
    const countries = { "US": "United States", "CA": "Canada", "MX": "Mexico" };
    return countries[countryCode] || countryCode;
  }

  getCityTimezone(city) {
    const timezoneMap = {
      "Vancouver": "America/Vancouver",
      "Montreal": "America/Toronto",
      "Calgary": "America/Edmonton",
      "Ottawa": "America/Toronto",
      "Mexico City": "America/Mexico_City",
      "Guadalajara": "America/Mexico_City",
      "Monterrey": "America/Mexico_City",
      "Tijuana": "America/Tijuana",
      "Sao Paulo": "America/Sao_Paulo",
      "Rio de Janeiro": "America/Sao_Paulo",
      "Brasilia": "America/Sao_Paulo",
      "Buenos Aires": "America/Argentina/Buenos_Aires",
      "Santiago": "America/Santiago",
      "Lima": "America/Lima",
      "Bogota": "America/Bogota",
      "Caracas": "America/Caracas",
      "Quito": "America/Guayaquil",
      "La Paz": "America/La_Paz",
      "Montevideo": "America/Montevideo",
      "Asuncion": "America/Asuncion"
    };
    return timezoneMap[city] || "UTC";
  }

  displayWeather(data) {
    const weatherContent = document.getElementById('weatherContent');
    const convertedTemp = this.convertTemperature(data.temperature);
    const isHot = data.temperature > 30;
    const displayCondition = isHot ? 'hot' : data.condition;
    const timezone = this.getCityTimezone(data.city);
    const countryName = this.getCountryName(data.country);

    weatherContent.innerHTML = `
      <div class="weather-card">
        <div class="current-weather">
          <div class="weather-info">
            <h2>${data.city}, ${countryName}</h2>
            <div class="current-time" id="currentTime" data-timezone="${timezone}"></div>
            <div class="temperature">${convertedTemp}${this.getUnitSymbol()}</div>
            <div class="weather-description">${data.description}</div>
            <div class="weather-details">
              <div>💧 Humidity: ${data.humidity}%</div>
              <div>💨 Wind Speed: ${data.windSpeed} km/h</div>
              <div>🌡️ Pressure: ${data.pressure} hPa</div>
              <div>👁️ Visibility: ${data.visibility} km</div>
            </div>
          </div>
          <div class="animation-container" id="weatherAnimation">
            ${this.getWeatherAnimation(displayCondition)}
          </div>
        </div>
      </div>
    `;
    this.startWeatherAnimations(displayCondition);
    this.startRealTimeClock();
  }

  getWeatherAnimation(condition) {
    switch (condition) {
      case "rainy":
        return `<div class="rain" style="left:20%"></div><div class="rain" style="left:40%"></div>`;
      case "hot":
        return `<div class="anime-sun"></div><div>🥵💦</div>`;
      case "sunny":
        return `<div class="anime-sun"></div><div>😎🌞</div>`;
      default:
        return `<div class="anime-cloud">☁️</div>`;
    }
  }

  startWeatherAnimations(condition) {
    if (condition === "rainy") {
      this.createRainAnimation();
    }
  }

  createRainAnimation() {
    const animationContainer = document.getElementById('weatherAnimation');
    const raindrop = document.createElement('div');
    raindrop.className = 'rain';
    raindrop.style.left = Math.random() * 100 + '%';
    animationContainer.appendChild(raindrop);
    setTimeout(() => { raindrop.remove(); }, 2000);
  }

  startRealTimeClock() {
    this.updateClock();
    setInterval(() => { this.updateClock(); }, 1000);
  }

  updateClock() {
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
      const timezone = timeElement.getAttribute('data-timezone') || 'UTC';
      const now = new Date();
      const localTime = new Date(now.toLocaleString("en-US", {timeZone: timezone}));
      const hours = localTime.getHours().toString().padStart(2,'0');
      const minutes = localTime.getMinutes().toString().padStart(2,'0');
      const seconds = localTime.getSeconds().toString().padStart(2,'0');
      timeElement.innerHTML = `🕐 ${hours}:${minutes}:${seconds}`;
    }
  }
}

const app = new ThunderfrostWeather();
// Example usage
app.displayWeather({
  city: "Montreal",
  country: "CA",
  temperature: 28,
  condition: "sunny",
  description: "Clear skies",
  humidity: 60,
  windSpeed: 15,
  pressure: 1015,
  visibility: 10,
  hourlyForecast: []
});
