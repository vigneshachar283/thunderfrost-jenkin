let chart;
const ctx = document.getElementById('weatherChart').getContext('2d');

function initChart() {
  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        label: 'Temperature (°C)',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: { y: { beginAtZero: true } }
    }
  });
}

async function getWeather() {
  const dropdownCity = document.getElementById('cityDropdown').value;
  const inputCity = document.getElementById('cityInput').value.trim();
  const city = inputCity || dropdownCity;

  if (!city) {
    alert("Please select or type a city.");
    return;
  }

  const response = await fetch('/get_weather', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ city })
  });

  const data = await response.json();
  if (data.error) {
    alert(data.error);
    return;
  }

  document.getElementById('weatherInfo').innerHTML = `
    <h2>${data.city}</h2>
    <p>🌡 Temp: ${data.temperature}°C</p>
    <p>🕒 Last Updated: ${data.last_updated}</p>
    <p>🌧 Next Hour (${data.next_hour}) Rain Probability: ${data.rain_probability}%</p>
  `;

  updateAnimation(data);
  updateChart(data);
}

function updateAnimation(data) {
  const animDiv = document.getElementById('animation');
  animDiv.innerHTML = '';

  if (data.temperature > 30) {
    animDiv.innerHTML = '<div class="hot">🔥 Heatwave</div>';
  } else if (data.rain_probability > 50) {
    animDiv.innerHTML = '<div class="rain"></div>';
  } else if (data.temperature < 5) {
    animDiv.innerHTML = '<div class="snow"></div>';
  } else {
    animDiv.innerHTML = '<div class="sun"></div>';
  }
}

function updateChart(data) {
  const index = chart.data.labels.indexOf(data.city);
  if (index === -1) {
    chart.data.labels.push(data.city);
    chart.data.datasets[0].data.push(data.temperature);
  } else {
    chart.data.datasets[0].data[index] = data.temperature;
  }
  chart.update();
}

function resetAll() {
  document.getElementById('weatherInfo').innerHTML = '';
  document.getElementById('animation').innerHTML = '';
  chart.data.labels = [];
  chart.data.datasets[0].data = [];
  chart.update();
}

window.onload = initChart;
