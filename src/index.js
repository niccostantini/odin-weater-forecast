import "./styles.css";
import "./normalize.css";

//import images
import clear from "./assets/images/clear.webp";
import cloudy from "./assets/images/clody.webp";
import cloudRainy from "./assets/images/cloudy-rainy.webp";
import overcast from "./assets/images/overcast.webp";
import partiallyCloudyRainy from "./assets/images/partially-cloudy-rainy.webp";
import partiallyCloudy from "./assets/images/partially-cloudy.webp";
import snowy from "./assets/images/snowy.webp";
import stormy from "./assets/images/stormy.webp";

const weatherImages = {
    clear,
    cloudy,
    cloudRainy,
    overcast,
    partiallyCloudyRainy,
    partiallyCloudy,
    snowy,
    stormy
};

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

//default city
let city = "Otranto";
let url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${key}`;

//reset displayed data
function resetDisplayedData(fields) {
  fields.forEach((field) => {
    field.textContent = "Couldn't fetch data";
  });

  fields[2].textContent = "？";
}

//display data on the page
function displayData(data) {
  const locationElement = document.querySelector(".location");
  const dateElement = document.querySelector(".date");
  const weatherElementIcon = document.querySelector(".weather .icon");
  const weatherElementText = document.querySelector(".weather .text");
  const temperatureElement = document.querySelector(".temperature .text");
  const descriptionElement = document.querySelector(".description");

  let icon = "";
  let imgUrl = "";

  //change bgimage based on weather conditions
  let dataContitionsLC = data.conditions.toLowerCase();
  if (dataContitionsLC == "clear") {
    imgUrl = weatherImages.clear;
    icon = "☀️";
  } else if (dataContitionsLC == "cloudy") {
    imgUrl = weatherImages.cloudy;
    icon = "☁️";
  } else if (dataContitionsLC == "rain, partially cloudy") {
    imgUrl = weatherImages.partiallyCloudyRainy;
    icon = "🌦️";
  } else if (dataContitionsLC == "overcast") {
    imgUrl = weatherImages.overcast;
    icon = "😶‍🌫️";
  }   else if (dataContitionsLC == "partially cloudy") {
    imgUrl = weatherImages.partiallyCloudy;
    icon = "⛅";
  } else if (dataContitionsLC.includes("snow")) {
    imgUrl = weatherImages.snowy;
    icon = "❄️";
  } else if (dataContitionsLC == "rain") {
    imgUrl = weatherImages.cloudRainy;
    icon = "🌧️";
  } else if (dataContitionsLC == "thunderstorm") {
    imgUrl = weatherImages.stormy;
    icon = "⛈️";
  } else if (dataContitionsLC == "rain, overcast") {
    imgUrl = weatherImages.cloudRainy;
    icon = "🌧️";
  } else {
    imgUrl = weatherImages.clear;
    icon = "🌤️";
  }

  //set background image
  info.style.backgroundImage = `linear-gradient(to bottom, rgba(224, 224, 224, 0.3), rgba(234, 234, 234, 0.9)), url('${imgUrl}')`;

  //convert temperature from Fahrenheit to Celsius
  const toCelsius = ((data.temp - 32) * (5 / 9)).toFixed(2);

  //reset displayed data
  resetDisplayedData(resettableFields);

  //display data
  locationElement.textContent = data.address;
  dateElement.textContent = data.datetime;
  weatherElementIcon.textContent = icon;
  weatherElementText.textContent = `${data.conditions}`;
  temperatureElement.innerHTML = `${toCelsius}°C`;
  descriptionElement.textContent = data.description;
}

//fetch weather data
async function getWeatherData(index = 0) {
  try {
    //fetch data
    const response = await fetch(url);
    //parse data
    const data = await response.json();
    //log data
    let n = index;
    let newData = {
      address: data.address,
      datetime: data.days[n].datetime,
      conditions: data.days[n].conditions,
      temp: data.days[n].temp,
      description: data.days[n].description
    };
    console.log(newData);
    //display data
    displayData(newData);
    //show info
    if (info.classList.contains("hide")) {
      toggleVisibility(info);
    }
  } catch (error) { //catch errors
    console.error("Error fetching weather data:", error);
    resetDisplayedData(resettableFields); //reset displayed data
    alert("Couldn't fetch data. Check for misspelled city name or try again later."); //alert user
    info.classList.remove("show"); //hide info
    info.classList.add("hide");    //
  }
}

//hide #info on page load
toggleVisibility(info) //hide #info on page load

//query the API through the form
const form = document.querySelector("form");
form.addEventListener("submit", async function (event) {
  
  //retrieve index corresponding to selected day
  const dayElement = document.querySelector("#day");
  let dayIndex = dayElement.options[dayElement.selectedIndex].id;
  console.log(dayIndex);

  //prevent default form submission
  event.preventDefault();

  //get city and country from form
  let city = form.elements.city.value;
  url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${key}`;

  //display loading message
  const loading = document.querySelector("#loading");
  loading.style.display = "block";
  toggleVisibility(loading);

  await new Promise(resolve => setTimeout(resolve, 500));

  //fetch data
  await getWeatherData(dayIndex);
  
  //hide loading message
  loading.style.display = "none";
  toggleVisibility(loading);
});