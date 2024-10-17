import "./styles.css";
import "./normalize.css";

const resettableFields = [
  document.querySelector(".location"),
  document.querySelector(".date"),
  document.querySelector(".weather .icon"),
  document.querySelector(".weather .text"),
  document.querySelector(".temperature .text"),
  document.querySelector(".description")
];

const info =  document.querySelector("#info");

//toggle visibility of elements
function toggleVisibility(element) {
  element.classList.toggle("hide");
  element.classList.toggle("show");
}

//.container fades in after 200ms
document.addEventListener("DOMContentLoaded", function () {
  const containers = document.querySelectorAll(".container");
    containers.forEach(container => setTimeout(toggleVisibility(container), 200)
  );
});

//fetch data from Visual Crossing API using the key UHUAQQ624THSMFADZF7E9S556
const key = "UHUAQQ624THSMFADZF7E9S556";
// let city = prompt("Enter city name");
// let country = prompt("Enter country name");
let city = "Otrsggsanto";
let country = "Itdfhgsdaly";
let url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city},${country}?key=${key}`;
let weatherData;

function resetDisplayedData(fields) {
  fields.forEach((field) => {
    field.textContent = "Couldn't fetch data";
  });

  fields[2].textContent = "？";
}

function displayData(data) {
  const locationElement = document.querySelector(".location");
  const dateElement = document.querySelector(".date");
  const weatherElementIcon = document.querySelector(".weather .icon");
  const weatherElementText = document.querySelector(".weather .text");
  const temperatureElement = document.querySelector(".temperature .text");
  const descriptionElement = document.querySelector(".description");

  resetDisplayedData(resettableFields);

  locationElement.textContent = data.address;

  dateElement.textContent = data.datetime;

  weatherElementIcon.textContent = "🌤️";

  weatherElementText.textContent = `${data.conditions}`;

  temperatureElement.innerHTML = `${data.temp}°C`;

  descriptionElement.textContent = data.description;
}

async function getWeatherData() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    let newData = {
      address: data.address,
      datetime: data.currentConditions.datetime,
      conditions: data.currentConditions.conditions,
      temp: data.currentConditions.temp,
      description: data.description
    };
    displayData(newData);
    if (info.classList.contains("hide")) {
      toggleVisibility(info);
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
    resetDisplayedData(resettableFields); //reset displayed data
    alert("Couldn't fetch data. Check for misspelled city or country.");
    toggleVisibility(info); //hide info
  }
}

toggleVisibility(info) //hide #info on page load

//query the API through the form
const form = document.querySelector("form");
form.addEventListener("submit", function (event) {
  event.preventDefault();
  city = form.elements.city.value;
  country = form.elements.country.value;
  url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city},${country}?key=${key}`;
  getWeatherData();
});