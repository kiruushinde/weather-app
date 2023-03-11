const userTab = document.querySelector("[userWeather]");
const searchTab = document.querySelector("[searchWeather]");
const weatherContainer = document.querySelector(".weather-container");
const locationContainer = document.querySelector(".location-container");
const formContainer = document.querySelector(".form-container");
const searchForm = document.querySelector("[searchWeather]");
const loadingScreen = document.querySelector(".loading-container");
const weatherInfo = document.querySelector(".weather-info");

// initially needed variables
let currentTab = userTab;
const API_key = "21e3f8e7edbb820311ee347c622fb833";

currentTab.classList.add("current-tab");
searchForm.classList.remove("active");
getCoordinatesFromSession();

function switchTab(clickTab) {
    // if both the tabs are different then we will do something
    if (clickTab != currentTab) {
        currentTab.classList.remove("current-tab");

        currentTab = clickTab;
        currentTab.classList.add("current-tab");
        formContainer.classList.add("active");
        if (!searchForm.classList.contains("active")) {
            // if search form container is invisible then make it visible
            weatherInfo.classList.remove("active");
            locationContainer.classList.remove("active");
            searchForm.classList.add("active");
            errorMsg.classList.remove("active");
        } else {
            searchForm.classList.remove("active");
            formContainer.classList.remove("active");
            weatherInfo.classList.add("active");
            errorMsg.classList.remove("active");

            // now else you are on your location tab, so you need coordinates to fetch the location
            getCoordinatesFromSession();
        }
    }
}


userTab.addEventListener('click', () => {
    // pass clicked tab as input parameter
    switchTab(userTab);

});

searchTab.addEventListener('click', () => {
    switchTab(searchTab);
})

// checks for coordinates.
function getCoordinatesFromSession() {
    // we are fetching coords from localCorods
    const localCoordinates = sessionStorage.getItem("user-coordinates");

    // if coords are not present, which mean you need to give permission to your location, so making that div visible
    if (!localCoordinates) {
        locationContainer.classList.add("active");
    } else {
        // if local coords are available, then use them, i.e. latitude and longitude
        /* #️⃣ json.parse converts json string to json object  */
        const coordinates = JSON.parse(localCoordinates);

        // you have lat and longitude..
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates) {
    // getting the lat and log from coords
    const { lat, lon } = coordinates;
    // make location container invisible
    locationContainer.classList.remove("active");

    // display the loader
    loadingScreen.classList.add("active");

    // call the API
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`);

        const data = await response.json();

        // once get the data, remove the loader
        loadingScreen.classList.remove("active");
        // and make visible display information
        weatherInfo.classList.add("active");

        // now we need to render all this information on UI
        renderWeatherInfo(data);
    } catch (err) {
        // if you not get data, we show error message
        // so remove loader screen
        loadingScreen.classList.remove("active");
        // active error message
        console.log("cannot fetch information : ", err);
    }
}

function renderWeatherInfo(weatherInform) {
    console.log("rendering the information..");
    // first we need to fetch all those elements on which we need to render the information.
    const cityName = document.querySelector("[cityName]");
    const countryIcon = document.querySelector("[countryIcon]");
    const descri = document.querySelector("[weatherDescr]");
    const weatherIcon = document.querySelector("[weatherIcon]");
    const temp = document.querySelector("[weatherTemp]");
    const windspeed = document.querySelector("[windSpeed]");
    const humidity = document.querySelector("[humidity]");
    const cloudiness = document.querySelector("[Cloudiness]");

    /* ❤️ use optional chaining operator in order to fetch the details from json objects  */

    // cdn link to convert to country name to flag img
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInform?.sys?.country.toLowerCase()}.png`;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInform?.weather?.[0]?.icon}.png`;
    // cityName.innerText = weatherInform ? .name;
    // descri.innerText = weatherInform ? .[0] ? .description;
    // temp.innerText = weatherInform ? .main ? .temp;
    // windspeed.innerText = weatherInform ? .wind ? .speed;
    // humidity.innerText = weatherInform ? .main ? .humidity;
    // cloudiness.innerText = weatherInform ? .clouds ? .all;
    cityName.innerText = `${weatherInform?.name}`;
    descri.innerText = `${weatherInform ?.weather ?.[0] ?.description}`;
    temp.innerText = `${ weatherInform ?.main ?.temp} °C`;
    windspeed.innerText = `${weatherInform ?.wind ?.speed} m/s`;
    humidity.innerText = `${weatherInform ?.main ?.humidity}%`;
    cloudiness.innerText = `${weatherInform ?.clouds ?.all}%`;
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        // show an 
        alert("No geolocation supported ");
    }
}

function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));

    fetchUserWeatherInfo(userCoordinates);
}


const grantAccessBtn = document.querySelector("[grantAccess]");
grantAccessBtn.addEventListener("click", getLocation);

const searchInput = document.querySelector("[searchInput]");

formContainer.addEventListener("submit", (e) => {
    e.preventDefault();

    let cityName = searchInput.value;

    if (cityName === "") {
        return;
    } else {
        console.log("searching entered city");
        fetchSearchWeatherInfo(cityName);
    }
})

let errorMsg = document.querySelector(".error");

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    weatherInfo.classList.remove("active");
    locationContainer.classList.remove("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}`);
        const data = await response.json();
        console.log(data);
        if (response.status != 404) {
            console.log("city found..");
            loadingScreen.classList.remove("active");
            weatherInfo.classList.add("active");
            renderWeatherInfo(data);
        } else {
            renderError();
        }

    } catch (er) {
        console.log("city not found ", er);
        // handle error
        // errorMsg.classList.add("active");
        // weatherInfo.classList.remove("active");
        // console.log("cannot fetch data : ", error);
    }
}

function renderError() {
    console.log("no data found ..");
    errorMsg.classList.add("active");
    loadingScreen.classList.remove("active");
    return;
}