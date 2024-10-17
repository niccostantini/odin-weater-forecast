import "./styles.css";
import "./normalize.css";

const weatherImages = {
  "clear": "https://raw.githubusercontent.com/niccostantini/odin-weater-forecast/refs/heads/main/src/assets/images/clear.webp",
  "cloudy": "https://raw.githubusercontent.com/niccostantini/odin-weater-forecast/refs/heads/main/src/assets/images/clody.webp",
  "cloudRainy": "https://raw.githubusercontent.com/niccostantini/odin-weater-forecast/refs/heads/main/src/assets/images/cloudy-rainy.webp",
  "overcast": "https://raw.githubusercontent.com/niccostantini/odin-weater-forecast/refs/heads/main/src/assets/images/overcast.webp",
  "partiallyCloudyRainy": "https://raw.githubusercontent.com/niccostantini/odin-weater-forecast/refs/heads/main/src/assets/images/partially-cloudy-rainy.webp",
  "partiallyCloudy": "https://raw.githubusercontent.com/niccostantini/odin-weater-forecast/refs/heads/main/src/assets/images/partially-cloudy.webp",
  "snowy": "https://raw.githubusercontent.com/niccostantini/odin-weater-forecast/refs/heads/main/src/assets/images/snowy.webp",
  "stormy": "https://raw.githubusercontent.com/niccostantini/odin-weater-forecast/refs/heads/main/src/assets/images/stormy.webp"
}

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

  info.style.backgroundImage = `linear-gradient(to bottom, rgba(224, 224, 224, 0.3), rgba(234, 234, 234, 0.9)), url('${imgUrl}')`;

  const toCelsius = ((data.temp - 32) * (5 / 9)).toFixed(2);

  resetDisplayedData(resettableFields);

  locationElement.textContent = data.address;
  dateElement.textContent = data.datetime;
  weatherElementIcon.textContent = icon;
  weatherElementText.textContent = `${data.conditions}`;
  temperatureElement.innerHTML = `${toCelsius}°C`;
  descriptionElement.textContent = data.description;
}

async function getWeatherData(index = 0) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    let n = index;
    let newData = {
      address: data.address,
      datetime: data.days[n].datetime,
      conditions: data.days[n].conditions,
      temp: data.days[n].temp,
      description: data.days[n].description
    };
    console.log(newData);
    displayData(newData);
    if (info.classList.contains("hide")) {
      toggleVisibility(info);
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
    resetDisplayedData(resettableFields); //reset displayed data
    alert("Couldn't fetch data. Check for misspelled city or country.");
    info.classList.remove("show"); //hide info
    info.classList.add("hide");
  }
}

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
  city = form.elements.city.value;
  country = form.elements.country.value;
  url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city},${country}?key=${key}`;

  //display loading message
  const loading = document.querySelector("#loading");
  loading.style.display = "block";
  toggleVisibility(loading);

  //fetch data
  await getWeatherData(dayIndex);

  //hide loading message
  loading.style.display = "none";
  toggleVisibility(loading);
});