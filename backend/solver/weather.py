import requests

# Set up API key and base URL


# Get current timestamp
import time
current_time = int(time.time())

# Get historical weather data for each day in the past year
historical_weather_data = []
for i in range(365):
    timestamp = current_time - i * 86400  # Subtract i days in seconds
    response = requests.get(f'{BASE_URL}&dt={timestamp}')
    if response.status_code == 200:
        historical_weather_data.append(response.json())
    else:
        print(f'Request failed for timestamp {timestamp}. Error code: {response.status_code}')

# historical_weather_data will contain a list of weather data for each day in the past year
# You can access various weather information from the API response, such as temperature, humidity, etc.
# Note that the API response may be in metric or imperial units, depending on your API configuration
