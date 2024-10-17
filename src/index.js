import "./styles.css";
import "./normalize.css";

//.container fades in after 200ms
document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector(".container");
  setTimeout(function () {
    container.classList.toggle("hide");
    container.classList.toggle("show");
  }, 200);
});

//fetch data from Visual Crossing API using the key UHUAQQ624THSMFADZF7E9S556
const key = "UHUAQQ624THSMFADZF7E9S556";
let city = "Rome";
let country = "Italy";
let url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city},${country}?key=${key}`;
async function getWeatherData() {
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
}

getWeatherData();