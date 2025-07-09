
// Demo data for when API key is not available
const demoWeather = {
    name: 'New York',
    main: {
        temp: 22,
        feels_like: 25,
        humidity: 65,
        pressure: 1013
    },
    weather: [{
        main: 'Clouds',
        description: 'scattered clouds',
        icon: '03d'
    }],
    wind: {
        speed: 3.5
    },
    sys: {
        country: 'US'
    }
};

// DOM elements
const searchForm = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const weatherCard = document.getElementById('weatherCard');
const demoNotice = document.getElementById('demoNotice');

// Weather display elements
const cityName = document.getElementById('cityName');
const weatherIcon = document.getElementById('weatherIcon');
const tempValue = document.getElementById('tempValue');
const weatherDescription = document.getElementById('weatherDescription');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const pressure = document.getElementById('pressure');

// Show/hide elements
function showElement(element) {
    element.style.display = 'block';
}

function hideElement(element) {
    element.style.display = 'none';
}

// Get weather icon URL
function getWeatherIcon(iconCode) {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

// Display weather data
function displayWeather(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    weatherIcon.src = getWeatherIcon(data.weather[0].icon);
    weatherIcon.alt = data.weather[0].description;
    tempValue.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${data.wind.speed} m/s`;
    pressure.textContent = `${data.main.pressure} hPa`;
    
    showElement(weatherCard);
}

// Show error message
function showError(message) {
    error.textContent = `Error: ${message}`;
    showElement(error);
    hideElement(weatherCard);
}

// Fetch weather data
async function fetchWeather(cityName) {
    // Show loading state
    showElement(loading);
    hideElement(error);
    hideElement(weatherCard);
    
    try {
        // For demo purposes, use demo data if API key is placeholder
        if (API_KEY === 'your-api-key-here') {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            const data = { ...demoWeather, name: cityName };
            displayWeather(data);
            showElement(demoNotice);
        } else {
            const response = await fetch(
                `${API_URL}?q=${cityName}&appid=${API_KEY}&units=metric`
            );
            
            if (!response.ok) {
                throw new Error('City not found');
            }
            
            const data = await response.json();
            displayWeather(data);
            hideElement(demoNotice);
        }
    } catch (err) {
        showError(err.message);
    } finally {
        hideElement(loading);
    }
}

// Handle form submission
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
    }
});

// Load default city on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchWeather('New York');
    
    // Show demo notice if using placeholder API key
    if (API_KEY === 'your-api-key-here') {
        showElement(demoNotice);
    }
});
