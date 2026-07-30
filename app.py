from flask import Flask, render_template, request, jsonify
import requests
from datetime import datetime, timedelta
import pytz

app = Flask(__name__)

GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1"
WEATHER_URL = "https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true&hourly=precipitation_probability&timezone=auto"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_weather', methods=['POST'])
def get_weather():
    data = request.json
    city = data.get('city')

    geo_resp = requests.get(GEOCODE_URL.format(city=city)).json()
    if "results" not in geo_resp:
        return jsonify({"error": "City not found"})

    lat = geo_resp['results'][0]['latitude']
    lon = geo_resp['results'][0]['longitude']
    timezone = geo_resp['results'][0]['timezone']

    weather_resp = requests.get(WEATHER_URL.format(lat=lat, lon=lon)).json()

    if "current_weather" not in weather_resp:
        return jsonify({"error": "Weather not available"})

    temp = weather_resp['current_weather']['temperature']
    time_str = weather_resp['current_weather']['time']
    current_time = datetime.fromisoformat(time_str)
    local_time = current_time.astimezone(pytz.timezone(timezone))

    hours = weather_resp["hourly"]["time"]
    probs = weather_resp["hourly"]["precipitation_probability"]
    next_hour_index = hours.index((current_time + timedelta(hours=1)).strftime("%Y-%m-%dT%H:00"))
    next_hour_prob = probs[next_hour_index]

    return jsonify({
        "city": city.title(),
        "temperature": temp,
        "last_updated": local_time.strftime("%H:%M"),
        "next_hour": (local_time + timedelta(hours=1)).strftime("%H:00"),
        "rain_probability": next_hour_prob
    })

if __name__ == '__main__':
    app.run(debug=True)
