const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
let currentTab = userTab;
const API_KEY = "e20fd1502757e27014c71546d180636e";

// Move DOM element selection above function calls
const searchForm = document.querySelector("[data-searchForm]");
const grantAccess = document.querySelector(".grant-location");
const userInfo = document.querySelector(".userWeather-container");
const loadingScreen = document.querySelector(".loading-container");
const grantAccessBtn = document.querySelector("[data-grantAccessBtn]");
const searchInput = document.querySelector("[data-searchInput]");
const apiErrorContainer = document.querySelector(".api-error-container");
const apiErrorMessage = document.querySelector(".api-error-message");
const apiErrorBtn = document.querySelector(".api-error-btn");

currentTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickedTab) {
  if (currentTab !== clickedTab) {
    currentTab.classList.remove("current-tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");

    if (!searchForm.classList.contains("active")) {
      userInfo.classList.remove("active");
      grantAccess.classList.remove("active");
      searchForm.classList.add("active");
    } else {
      searchForm.classList.remove("active");
      userInfo.classList.remove("active");
      getfromSessionStorage();
    }
  }
}

userTab.addEventListener("click", () => switchTab(userTab));
searchTab.addEventListener("click", () => switchTab(searchTab));

function getfromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if (!localCoordinates) {
    grantAccess.classList.add("active");
  } else {
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

async function fetchUserWeatherInfo(coordinates) {
  const { lat, lon } = coordinates;
  grantAccess.classList.remove("active");
  loadingScreen.classList.add("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfo.classList.add("active");
    renderWeatherInfo(data);
  } catch (error) {
    loadingScreen.classList.remove("active");
    apiErrorContainer.classList.add("active");
    apiErrorMessage.innerText = `Error: ${error?.message}`;
    apiErrorBtn.addEventListener("click", () => fetchUserWeatherInfo(coordinates));
  }
}

function renderWeatherInfo(weatherInfo) {
  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDes]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windSpeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const Cloudiness = document.querySelector("[data-clouds]");

  cityName.innerText = weatherInfo?.name;
  desc.innerText = weatherInfo?.weather?.[0]?.main;
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temp.innerText = `${weatherInfo?.main?.temp} °C`;
  windSpeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
  humidity.innerText = `${weatherInfo?.main?.humidity}%`;
  Cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    grantAccessBtn.style.display = "none";
    apiErrorMessage.innerText = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };
  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

grantAccessBtn.addEventListener("click", getLocation);

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let cityName = searchInput.value.trim();
  if (cityName === "") return;
  fetchSearchWeatherInfo(cityName);
});

async function fetchSearchWeatherInfo(city) {
  loadingScreen.classList.add("active");
  userInfo.classList.remove("active");
  grantAccess.classList.remove("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfo.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
    loadingScreen.classList.remove("active");
    apiErrorContainer.classList.add("active");
    apiErrorMessage.innerText = err?.message;
    apiErrorBtn.style.display = "none";
  }
}

                

           






// const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
// async function showWeather()
// {
// let city = "goa";
// const response =  await fetch(
//     `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
//   );
// const data =  await response.json();
// console.log("weather data =" , data);
// }
