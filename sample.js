// lets create a function to call function weather
console.log("hello meri jaan ");
const API_key = "21e3f8e7edbb820311ee347c622fb833";
async function showWeather() {
    // let latitude = 12.343;
    // let longitude = 15.213;

    try {
        let city = "Kolhapur";

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}`);

        const data = await response.json();
        console.log("weather data is : ", data);

        // let's access data and append to body

        let newPara = document.createElement("p");
        newPara.textContent = `${data?.main?.temp.toFixed(2)} C`;

        document.body.appendChild(newPara);
    } catch (error) {
        console.log("Error while fetching data.." + error);
    }

}

// showWeather();

async function customWeatherDetails() {
    try {
        let lat = 17.63;
        let long = 18.33;

        const result = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_key}`);

        const data = await result.json();

        console.log("Weather data --> ", data);

    } catch (err) {
        console.log("Error found ", err);
    }
}