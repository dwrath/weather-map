import keys from './keys.js'
import WeatherCard from "./components/WeatherCard.js";
import {geocode, reverseGeocode} from "./mapbox-geocoder-utils.js";

let marker;

mapboxgl.accessToken = keys.mapbox;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/satellite-streets-v12', // style URL
    center: [-98.48962, 29.42692], // starting position [lng, lat]
    zoom: 9, // starting zoom
});
/***********DEFAULT VALUES*******************/
 let cityLon = -98.489975;
  let cityLat = 29.42663;
 /**********END DEFAULT VALUES*************/

 /**********************GET REQUESTS********************************/
const getCurrentWeather = async (lat=cityLat, lon=cityLon) => {
    try {
        let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${keys.weathermap}&units=imperial`)
        let data = await res.json()
        return data
    } catch (error) {
        console.log(error)
    }
}
const getFourDayForecast = async (lat =cityLat, lon=cityLon) => {
    try {
        let res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${keys.weathermap}&units=imperial`)
        let data = await res.json()
        return data
    } catch (error) {
        console.log(error)
    }
}
/*********************************END GET REQUESTS********************************************************/

/********************************DATA OUTPUT FUNCTIONS**************************************************/
function getDirection(degrees) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / (360 / directions.length)) % directions.length;

    return directions[index];
}
const getCurrentWeatherInfo = async (lat = cityLat, lon= cityLon) => {
    let currWeather = await getCurrentWeather(cityLat, cityLon)
    let temp = currWeather.main.temp
    let windSpeed = currWeather.wind.speed
    let sunrise = currWeather.sys.sunrise
    let sunset = currWeather.sys.sunset
    let description = currWeather.weather[0].description
    let feelsLike = currWeather.main.feels_like
    let high = currWeather.main.temp_max
    let low = currWeather.main.temp_min
    let windDirection = getDirection(currWeather.wind.deg)
    let daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const time = new Date(currWeather.dt * 1000);
    let day = daysOfTheWeek[time.getDay()]

    document.querySelector('#current-temp').innerHTML = `<h1 class="curr-weather-title justify-center">Todays Forecast</h1><h1 class="temp">${Math.round(temp)}°</h1>`
    document.querySelector('#wind-speed').innerHTML = `<p class="inline">Wind speed: ${windDirection} ${windSpeed} mph</p>`
    document.querySelector('#weather-details').innerHTML = `
        <svg class="sunrise" width="1200pt" height="1200pt" version="1.1" viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
         <g>
          <path fill="currentColor" d="m600 392.39c6.2148 0 12.176-2.4688 16.574-6.8633 4.3945-4.3945 6.8633-10.355 6.8633-16.574v-85.062c0-8.3711-4.4688-16.109-11.719-20.297s-16.188-4.1875-23.438 0-11.719 11.926-11.719 20.297v85.062c0 6.2188 2.4688 12.18 6.8633 16.574 4.3984 4.3945 10.359 6.8633 16.574 6.8633z"/>
          <path fill="currentColor" d="m827.95 620.34c0 6.2148 2.4688 12.176 6.8633 16.57 4.3984 4.3945 10.359 6.8672 16.574 6.8672h85.062c8.375 0 16.113-4.4688 20.301-11.719 4.1836-7.2539 4.1836-16.188 0-23.438-4.1875-7.2539-11.926-11.719-20.301-11.719h-85.062c-6.2148 0-12.176 2.4688-16.574 6.8633-4.3945 4.3945-6.8633 10.355-6.8633 16.574z"/>
          <path fill="currentColor" d="m263.55 643.78h85.062c8.375 0 16.109-4.4688 20.297-11.719 4.1875-7.2539 4.1875-16.188 0-23.438-4.1875-7.2539-11.922-11.719-20.297-11.719h-85.062c-8.375 0-16.113 4.4648-20.301 11.719-4.1836 7.25-4.1836 16.184 0 23.438 4.1875 7.25 11.926 11.719 20.301 11.719z"/>
          <path fill="currentColor" d="m405.67 459.16c4.3906 4.4102 10.355 6.8945 16.582 6.9023 6.2266 0.007812 12.195-2.4648 16.598-6.8633 4.4023-4.4023 6.875-10.375 6.8672-16.602-0.007812-6.2227-2.4922-12.191-6.9023-16.582l-60.148-60.148c-4.3906-4.4219-10.359-6.9141-16.59-6.9258-6.2305-0.007812-12.207 2.4609-16.613 6.8672-4.4062 4.4023-6.875 10.383-6.8633 16.613 0.007813 6.2305 2.5 12.199 6.9219 16.59z"/>
          <path fill="currentColor" d="m777.76 466.02c6.2148 0.007812 12.18-2.4609 16.57-6.8633l60.148-60.148c4.4219-4.3906 6.9141-10.359 6.9219-16.59 0.011718-6.2305-2.457-12.211-6.8633-16.613-4.4062-4.4062-10.383-6.875-16.613-6.8672-6.2305 0.011719-12.199 2.5039-16.59 6.9258l-60.148 60.148c-4.3945 4.3945-6.8633 10.355-6.8633 16.57 0 6.2188 2.4688 12.18 6.8633 16.574 4.3945 4.3945 10.355 6.8633 16.574 6.8633z"/>
          <path fill="currentColor" d="m1012.6 697.6h-230.06c17.121-40.352 20.383-85.238 9.2812-127.64-11.105-42.402-35.949-79.934-70.648-106.71-34.699-26.781-77.301-41.312-121.13-41.312s-86.434 14.531-121.13 41.312c-34.699 26.781-59.543 64.312-70.648 106.71-11.102 42.406-7.8398 87.293 9.2812 127.64h-230.06c-8.3711 0-16.109 4.4688-20.297 11.719-4.1875 7.2539-4.1875 16.188 0 23.438 4.1875 7.2539 11.926 11.719 20.297 11.719h825.12c8.3711 0 16.109-4.4648 20.297-11.719 4.1875-7.25 4.1875-16.184 0-23.438-4.1875-7.25-11.926-11.719-20.297-11.719z"/>
          <path fill="currentColor" d="m851.97 795.13h-503.95c-8.3711 0-16.109 4.4688-20.297 11.719-4.1875 7.2539-4.1875 16.188 0 23.438 4.1875 7.2539 11.926 11.719 20.297 11.719h503.95c8.3711 0 16.109-4.4648 20.297-11.719 4.1875-7.25 4.1875-16.184 0-23.438-4.1875-7.25-11.926-11.719-20.297-11.719z"/>
          <path fill="currentColor" d="m676.65 892.67h-153.3c-8.3711 0-16.109 4.4648-20.297 11.719-4.1875 7.25-4.1875 16.184 0 23.438 4.1875 7.25 11.926 11.719 20.297 11.719h153.3c8.3711 0 16.109-4.4688 20.297-11.719 4.1875-7.2539 4.1875-16.188 0-23.438-4.1875-7.2539-11.926-11.719-20.297-11.719z"/>
         </g>
        </svg>
        <h3>Sunrise: ${new Date(sunrise * 1000).toLocaleString()}</h3>
        <svg class="sunset" width="1200pt" height="1200pt" version="1.1" viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
         <path fill="currentColor" d="m0 775h1200v50h-1200zm100 100h1e3v50h-1e3zm100 100h800v50h-800zm400-550c-137.5 0-250 112.5-250 250h-50c0-165 135-300 300-300s300 135 300 300h-50c0-137.5-112.5-250-250-250z"/>
        </svg>
        <h3>Sunset: ${new Date(sunset * 1000).toLocaleString()}</h3>
    `;
    document.querySelector('#weather-bio').innerHTML = `<h1 class="summary-title">Forecast Summary</h1><p>Today's forecast is ${description}, With a tempature of ${Math.round(temp)}° and feels like ${Math.round(feelsLike)}°. The high for the day is ${Math.round(high)}° with a low of ${Math.round(low)}° and winds blowing ${windDirection} around ${windSpeed} mph.</p>`
    return currWeather
}


async function getDays(lat, lon) {
    let data = await getFourDayForecast(lat, lon)
    let daysArray = []
    let daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    data.list.forEach((forecast, index) => {
        if (index % 8 === 0 && index !== 0) {
            const time = new Date(forecast.dt * 1000);
            let day = daysOfTheWeek[time.getDay()]
            let high = `${Math.round(forecast.main.temp_max)}°`
            let low = `${Math.round(forecast.main.temp_min)}°`
            let desc = forecast.weather[0].description;
            let img = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`

            daysArray.push({dayOfWeek: day, high: high, low: low, description: desc, img: img})

        }
    });
    return daysArray
}
/*****************************END DATA OUTPUT FUNCTIONS********************************/

/******************************SEARCH & MAP FLY TO FUNCTIONALITY******************************************/
function debounce(func, delay) {
    let timer;
    return function (...args) {
        const context = this;
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(context, args), delay);
    };
}
// Mapbox fly to Search
document.querySelector('#fly').addEventListener('input', debounce(async function () {
    let address = document.querySelector('input').value;
    let lon, lat
    geocode(address, keys.mapbox).then(coords => {
        if (marker) {
            marker.remove();
        }
        lon = coords[0], lat = coords[1];
        cityLon = lon, cityLat = lat
        marker = new mapboxgl.Marker()
            .setLngLat(coords)
            .addTo(map);
        map.flyTo({
            center: {
                lon: coords[0],
                lat: coords[1]
            },
            essential: true // this animation is considered essential with respect to prefers-reduced-motion
        });


    });
    await getCurrentWeatherInfo(cityLat,cityLon)
    let fourDay = await getDays(cityLat, cityLon)
    let dayList = document.querySelector('#ext-forecast');
    dayList.innerHTML = ''
    fourDay.forEach(function (day) {
        new WeatherCard(day, dayList);
    });
    await changeBackground()
}, 1000))

/*******************END SEARCH & MAP FLY TO FUNCTIONALITY****************************/

/*********************DROP PIN AND SHOW FORECAST************************************/

map.on('click', async function(e) {
    let lngLat = e.lngLat;
    cityLon = lngLat.lng, cityLat = lngLat.lat
    reverseGeocode(lngLat, keys.mapbox).then(city=>{
        if (marker) {
            marker.remove();
        }
        marker = new mapboxgl.Marker()
            .setLngLat(lngLat)
            .addTo(map);
        map.flyTo({
            center: {
                lon: lngLat.lng,
                lat: lngLat.lat
            },
            essential: true // this animation is considered essential with respect to prefers-reduced-motion
        });
        document.querySelector('input').value = city
    })
    await getCurrentWeatherInfo(cityLat, cityLon)
    let fourDay = await getDays(cityLat, cityLon)
    let dayList = document.querySelector('#ext-forecast');
    dayList.innerHTML = ''
    fourDay.forEach(function (day) {
        new WeatherCard(day, dayList);
    });
    await changeBackground()
});
/**********************END********************************************************/
/******************************BACKGROUND CHANGES*************************************/
const changeBackground = async () => {
    let weather = await getCurrentWeatherInfo()
    weather = weather.weather[0].description
    if (weather == 'clear sky' || weather == 'sunny') {
        document.querySelector('.current-weather-background').style.backgroundImage = 'url(../images/sunny.gif)'
        document.querySelector('body').style.background = 'linear-gradient(#faf8f8 20%, #ab5b00 90%)';
    } else if (weather == 'partly cloudy' || weather == 'few clouds' || weather == 'broken clouds' || weather == 'overcast clouds') {
        document.querySelector('.current-weather-background').style.backgroundImage = 'url(../images/cloudy.gif)'
        document.querySelector('body').style.background = 'linear-gradient(#faf8f8 20%, #006bab 90%)';
    } else if (weather == 'thunderstorm') {
        document.querySelector('.current-weather-background').style.backgroundImage = 'url(../images/thunderstorm.gif)'
        document.querySelector('body').style.background = 'linear-gradient(#faf8f8 30%, #949494 90%)';
    }else if(weather=='light rain'||weather=='moderate rain'||weather=='mist'){
        document.querySelector('.current-weather-background').style.backgroundImage = 'url(../images/lightrain.gif)'
        document.querySelector('body').style.background = 'linear-gradient(#faf8f8 30%, #0c6900 90%)';
    }else if(weather == 'light snow'){
        document.querySelector('.current-weather-background').style.backgroundImage = 'url(../images/snow.gif)'
        document.querySelector('body').style.background = 'linear-gradient(#faf8f8 30%, #02304d 90%)';
    }
}
/*********************************END BACKGROUND CHANGES********************************/

/********************************INITIALIZATION ON PAGE LOAD***************************/
(async () => {
    let currentTemp = await getCurrentWeatherInfo()
    let fourDay = await getDays()
    fourDay.forEach(function (day) {
        let dayList = document.querySelector('#ext-forecast');
        new WeatherCard(day, dayList);
    });
    await changeBackground()
})()
/**********************************END**********************************************/