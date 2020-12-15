const currentInfoDisplayed = document.querySelector("#current-info");
const cityNameDisplayed = document.querySelector("#city-name");
const houseLayer = document.querySelector("#house-layer");
const daylightLayer = document.querySelector("#daylight-layer");
const temperatureLayer = document.querySelector("#temperature-layer");
const visibilityLayer = document.querySelector("#visibility-layer");
const cloudsLayer = document.querySelector("#clouds-layer");
const thunderLayer = document.querySelector("#thunder-layer");
const rainLayer = document.querySelector("#rain-layer");
const snowLayer = document.querySelector("#snow-layer");
const windLayer = document.querySelector("#wind-layer");
const desaturationLayer = document.querySelector("#desaturation-layer");

const res = fetch('/netlifyFunctions/functions');
//const key = res.json();
const key = '';
console.log(res);
//console.log(key);



// 102 Total Cities
const htmlIds = [
  // Canadian Cities (18)
  "calgary", "charlottetown", "edmonton", "fort-mcmurray", "fredericton", "halifax", "iqaluit", "montreal", "quebec", "regina", "saskatoon", "st-johns", "toronto", "vancouver", "victoria", "whitehorse", "winnipeg", "yellowknife",
  // US Cities (14)
  "boston", "dallas", "denver", "detroit", "las-vegas", "los-angeles", "memphis", "miami", "minneapolis", "new-orleans", "new-york", "phoenix", "san-jose", "seattle",
  // Greenland City (1)
  "nuuk",
  // Latin American Cities (24)
  "asunción", "bogota", "brasilia", "buenos-aires", "caracas", "cayenne", "georgetown", "guatemala-city", "havana", "lima", "managua", "mexico-city", "montevideo", "panama-city", "paramaribo", "port-au-prince", "quito", "san-josé", "san-juan", "san-salvador", "santiago", "santo-domingo", "sucre", "tegucigalpa",
  // European Cities (17)
  "amsterdam", "ankara", "berlin", "budapest", "dikson", "helsinki", "london", "madrid", "moscow", "paris", "reykjavik", "stockholm", "tiksi", "vorkuta", "ust-nera", "yakutsk",
  // Asian Cities (15)
  "baghdad", "beijing", "beirut", "dhaka", "hanoi", "jakarta", "jerusalem", "jiayuguan", "karachi", "manila", "seoul", "shanghai", "tashkent", "tehran", "tokyo",
  // Oceanic Cities (5)
  "auckland", "cairns", "honolulu", "sydney", "tarawa",
  // African Cities (8)
  "accra", "addis-ababa", "antananarivo", "bamako", "bangui", "ndjamena", "pretoria", "tripoli"
];
const TOTAL_CITIES = htmlIds.length;

const debugButtons = [
  "debug-heavy-rain",
  "debug-heavy-snow",
  "debug-thunderstorm",
  "debug-windy-rain",
  "debug-really-windy-rain",
  "debug-windy-snow",
  "debug-really-windy-snow",
  "debug-super-cold",
  "debug-super-hot",
  "debug-poor-visibility"
];
const TOTAL_DEBUG_CASES = debugButtons.length;

let timeHelper = {
  localHourMilitary: "",
  localHourAMPM: "",
  animationDirection: ""
}



function setDebugQuerySelectors(cityDataDebug)
{
  for (i = 0; i < TOTAL_DEBUG_CASES; i++) {
    cityDataDebug.buttons[i] = document.querySelector(`#${debugButtons[i]}`);

    if (cityDataDebug.buttons[i] == null)
      console.log(debugButtons[i]);
  }
}
function generateDebugTestData(i, cityDataDebug)
{
  cityDataDebug.temperature = 0;
  cityDataDebug.visibility = 10000;
  cityDataDebug.timezone = 0;
  cityDataDebug.dayLength = 14;
  cityDataDebug.wind = 0;
  
  if (i == 0)
    cityDataDebug.weather = "heavy rain";
  else if (i == 1)
    cityDataDebug.weather = "heavy snow";
  else if (i == 2)
    cityDataDebug.weather = "thunderstorm";
  else if (i == 3)
  {
    cityDataDebug.weather = "rain";
    cityDataDebug.wind = 6;
  }
  else if (i == 4)
  {
    cityDataDebug.weather = "rain";
    cityDataDebug.wind = 16;
  }
  else if (i == 5)
  {
    cityDataDebug.weather = "snow";
    cityDataDebug.wind = 6;
  }
  else if (i == 6)
  {
    cityDataDebug.weather = "snow";
    cityDataDebug.wind = 16;
  }
  else if (i == 7)
  {
    cityDataDebug.weather = "clear sky";
    cityDataDebug.temperature = -60;
  }
  else if (i == 8)
  {
    cityDataDebug.weather = "clear sky";
    cityDataDebug.temperature = 60;
  }
  else if (i == 9)
  {
    cityDataDebug.weather = "clear sky";
    cityDataDebug.visibility = 1000;
    cityDataDebug.temperature = 0;
  }
}
function addClickEventListenersToCityDebugButtons(cityDataDebug)
{
  for (i = 0; i < TOTAL_DEBUG_CASES; i++)
    clickedCityDebugAction(i, cityDataDebug);
}
const clickedCityDebugAction = (i, cityDataDebug) =>
    cityDataDebug.buttons[i].addEventListener("click", () =>
    {
      generateDebugTestData(i, cityDataDebug);
      updateTextArea(cityDataDebug);
      animateScene(cityDataDebug);
    });






function setQuerySelectors(cityData)
{
  for (i = 0; i < TOTAL_CITIES; i++)
  {
    cityData.buttons[i] = document.querySelector(`#${htmlIds[i]}`);

    if (cityData.buttons[i] == null)
      console.log(htmlIds[i]);
  }
}
function setCityURLs(cityData)
{
  // Use this to get the 2-character country codes https://www.worldatlas.com/aatlas/ctycodes.htm
  // Use this to make sure that the cities your checking have the correct time zone https://www.timeanddate.com/worldclock/
  
  for (i = 0; i < TOTAL_CITIES; i++)
  {
    let cityName = formatCityNameForURL(htmlIds[i]);
    
    cityData.urls[i] = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${key}`;


    // Special case where cities have names that are automatically converted into HTML format. The API requires for the special character to be unchanged.
    // The ó will become &#243; if handled in the previous if-else. Also needs country code because the PH version is the default.
    // I confirmed that this is for the capital of Paraguay/PY
    if (cityName === "asunción")
      cityData.urls[i] = "http://api.openweathermap.org/data/2.5/weather?q=asunción,py&appid=${key}";
    // I confirmed that this is for the capital of Costa Rica/CR
    else if (cityName === "san+josé")
      cityData.urls[i] = "http://api.openweathermap.org/data/2.5/weather?q=san+josé,cr&appid=${key}";
    else if (cityName === "victoria")
      cityData.urls[i] = "http://api.openweathermap.org/data/2.5/weather?lat=48.41&lon=-123.33&appid=${key}";
  }
}
function formatCityNameForURL(cityName){
  // The api needs '+' in the name where there would be a space, so replace the '-'' in the HTML id attributes with '+'
  cityName = cityName.replace(/-/g, '+');

  // Special cases where cities have dashes, hypens, or apostrophes in their name
  // Add country code to specify exactly which country the city is in if needed
  if (cityName === "ndjamena")
    cityName = "n'djamena"
  else if (cityName === "port+au+prince") //////////////+ instead of space?
    cityName = "port-au-prince";
  else if (cityName === "ust+nera")
    cityName = "ust-nera";
  else if (cityName === "st+johns")
    cityName = "st+john's,ca";
  // Wrong victoria gets picked, and/or API gives wrong coordinates for the correct Victoria
  // Manually find the correct coordinates and hardcode this as a special case
  // else if (cityName === "victoria")
  // cityName = "victoria,ca";
  else if (cityName === "santiago")
    cityName = "santiago,cl";
  else if (cityName === "montevideo")
    cityName = "montevideo,uy";
  else if (cityName === "san+jose")
    cityName = "san+jose,us";
  else if (cityName === "tarawa")
    cityName = "tarawa,ki";
  else if (cityName === "jerusalem")
    cityName = "jerusalem,il";

  return cityName;
}
function formatCityNameForHover(cityName){
  // The api needs '+' in the name where there would be a space, so replace the '-'' in the HTML id attributes with '+'
  cityName = cityName.replace(/-/g, ' ');

  // Special cases where cities have dashes, hypens, or apostrophes in their name
  // Add country code to specify exactly which country the city is in if needed
  if (cityName === "ndjamena")
    cityName = "n'djamena"
  else if (cityName === "port au prince")
    cityName = "port-au-prince";
  else if (cityName === "ust nera")
    cityName = "ust-nera";
  else if (cityName === "st johns")
    cityName = "st john's";
  else if (cityName === "quebec")
    cityName = "quebec city";

  return cityName;
}





function retreiveDataFromAPI(cityData, data)
{
  cityData.name = data.name;
  cityData.longitude = data.coord.lon;
  cityData.latitude = data.coord.lat;
  cityData.humidity = data.main.humidity;
  cityData.pressure = data.main.pressure;

  cityData.clouds = data.clouds.all;
  // the rain and snow parameters are not usually available and need to be accessed differently from the others
  // For some reason data['rain']['3h'] and data['snow']['1h'] give me an undefined value without triggering the catch,
  // and I tested them thoroughly enough to know that they will say undefined even when the alternate of 1h and 3h can give me a positive value.
  if (data['rain'] != undefined) {
    if (data['rain']['3h'] != undefined)
      cityData.rain = data['rain']['3h'];
    else if (data['rain']['1h'] != undefined)
      cityData.rain = data['rain']['1h'];
    else
      cityData.rain = 0;
  }
  else
    cityData.rain = 0;

  if (data['snow'] != undefined) {
    if (data['snow']['3h'] != undefined)
      cityData.snow = data['snow']['3h'];
    else if (data['snow']['1h'] != undefined)
      cityData.snow = data['snow']['1h'];
    else
      cityData.snow = 0;
  }
  else
    cityData.snow = 0;


  cityData.temperature = Math.round((data.main.temp - 273.15) * 10) / 10;
  if (data.visibility == undefined)
    cityData.visibility = "Not available";
  else
    cityData.visibility = data.visibility;
  cityData.weather = data.weather[0].description;
  cityData.wind = data.wind.speed;

  cityData.previousTimezone = cityData.timezone;
  cityData.timezone = data.timezone / 3600;

  cityData.dayLength = Math.round(((data.sys.sunset - data.sys.sunrise) / 3600));

  // Set the local time
  let hourLetters; //AM/PM
  let date = new Date();
  let utcHour = date.getUTCHours(); //0-23
  let localHourMilitary = (utcHour + cityData.timezone + 24) % 24; //0-23

  if (localHourMilitary >= 0 && localHourMilitary < 1) {
    localHourAMPM = 12;
    hourLetters = "AM";
  }
  else if (localHourMilitary >= 1 && localHourMilitary < 12) {
    localHourAMPM = Math.floor(localHourMilitary);
    hourLetters = "AM";
  }
  else if (localHourMilitary >= 12 && localHourMilitary < 13) {
    localHourAMPM = 12;
    hourLetters = "PM";
  }
  else if (localHourMilitary >= 13 && localHourMilitary < 24) {
    localHourAMPM = Math.floor(localHourMilitary) - 12;
    hourLetters = "PM";
  }

  if (((localHourMilitary * 10) / 5) % 2 == 1) {
    localHourAMPM += ":30"
    console.log("should add :30");
  }
  else {
    localHourAMPM += ":00"
  }
  localHourAMPM += hourLetters;

  // console.log(data);

  animationDirection = (cityData.timezone > cityData.previousTimezone) ? "CCW" : "CW";

  timeHelper.localHourAMPM = localHourAMPM;
  timeHelper.localHourMilitary = localHourMilitary;
  timeHelper.animationDirection = animationDirection;
}
function updateTextArea(cityData)
{
  // Reset the text area
  currentInfoDisplayed.innerHTML = ""

  if (cityData.name === "Quebec")
    cityData.name = "Quebec City";
  
  if (cityData.timezone >= 0)
    cityData.timezone = `+${cityData.timezone}`;

  currentInfoDisplayed.innerHTML += "Name: " + cityData.name + "\n";
  currentInfoDisplayed.innerHTML += "Weather: " + cityData.weather + "\n";
  currentInfoDisplayed.innerHTML += "Temperature: "
    + cityData.temperature + "°C\n";
  currentInfoDisplayed.innerHTML += "Clouds: " + cityData.clouds + "%\n";
  currentInfoDisplayed.innerHTML += "Wind: " + cityData.wind + "m/s\n";
  currentInfoDisplayed.innerHTML += "Rain: " + cityData.rain + "mm\n";
  currentInfoDisplayed.innerHTML += "Snow: " + cityData.snow + "mm\n";
  currentInfoDisplayed.innerHTML += "Humidity: "
    + cityData.humidity + "%\n";
  currentInfoDisplayed.innerHTML += "Pressure: "
    + cityData.pressure + "hPa\n";
  // Only add the unit for meters if the value is a number
  currentInfoDisplayed.innerHTML += "Visibility: "
    + cityData.visibility + (cityData.visibility === "Not available" ? "" : "m") + "\n\n";

  currentInfoDisplayed.innerHTML += "Local Time: "
    + timeHelper.localHourAMPM + "\n";
  currentInfoDisplayed.innerHTML += "Timezone: " + cityData.timezone + "h\n";
  currentInfoDisplayed.innerHTML += "Day Length: " + cityData.dayLength + "h\n";
  currentInfoDisplayed.innerHTML += "Longitude: "
    + cityData.longitude + "°\n";
  currentInfoDisplayed.innerHTML += "Latitude: "
    + cityData.latitude + "°";
}
function animateScene(cityData)
{
  // See https://openweathermap.org/weather-conditions to determine how the branches in this block should work

  // Having these variables makes the rest of the code more readable
  const temperature = cityData.temperature;
  const dayLength = cityData.dayLength;
  let weather = cityData.weather;
  let clouds = cityData.clouds;
  const wind = cityData.wind;

  // Math done with a unit circle starting at 0 degrees point at the right, and growing CCW
  // const daylightRotationRadians = (timeHelper.localHour * Math.PI/12) - (timeHelper.animationDirection == "CCW" ? 0 : (2 * Math.PI));
  const daylightRotationDegrees = (timeHelper.localHourMilitary * 15) + (timeHelper.animationDirection === "CCW" ? 0 : -360);

  // CSS does rotations with positive angles corresponding to CW rotations, so multiply my angle by -1
  daylightLayer.style = `transform: scale(5) rotate(${-1 * daylightRotationDegrees}deg);
                        background: url(images/daytime-${dayLength}.svg) no-repeat;`;

  // Modify temperature layer (non-svg layer)
  let tempOpacityCalculation = Math.abs(temperature) * 0.005;
  if (temperature < 0)
    temperatureLayer.style = `background-color: rgba(0, 0, 255, ${tempOpacityCalculation});`;
  else if (temperature > 0)
    temperatureLayer.style = `background-color: rgba(255, 100, 0, ${tempOpacityCalculation});`;


  // Visibility layer (non-svg layer)
  let visibilityMagnitude;
  weather = weather.toLowerCase();
  if (weather.includes("mist") || weather.includes("smoke") || weather.includes("haze")
    || weather.includes("sand") || weather.includes("dust") || weather.includes("fog")
    || weather.includes("ash") || weather.includes("squalls") || weather.includes("tornado")) {
    visibilityMagnitude = (10000 - (cityData.visibility / 5)) / 10000;
  }
  else
    visibilityMagnitude = (10000 - cityData.visibility) / 10000;
  // Don't let the opacity value for visibility go below 0
  visibilityMagnitude = visibilityMagnitude < 0 ? 0 : visibilityMagnitude;
  visibilityLayer.style = `opacity: ${visibilityMagnitude};`;

  // Thunder layer, 4 choices for how to do the flashing animation or invisibility
  let thunderMagnitude;
  if (weather.includes("thunderstorm")) {
    if (weather.includes("light"))
      thunderMagnitude = 1;
    else if (weather.includes("heavy"))
      thunderMagnitude = 3;
    else if (weather.includes("ragged"))
      thunderMagnitude = 4;
    else
      thunderMagnitude = 2;

    thunderLayer.style = `
      animation: thunder ${4 / thunderMagnitude}s linear infinite;`;
  }
  else
    thunderLayer.style = `
      animation: none;`;

  // Clouds layer, choose between 5 different svg files or invisibility
  const cloudMagnitude = (clouds >= 11) + (clouds >= 25) + (clouds >= 51) + (clouds >= 85) + (clouds >= 95);
  if (cloudMagnitude > 0) {
    cloudsLayer.style = `
      background: url(images/clouds-${cloudMagnitude}.svg) repeat-x;
      animation: clouds 1s linear infinite;
      opacity: 0.6;`;
  }
  else
    cloudsLayer.style = `
    animation: none;
    opacity: 0;`;

  // Rain layer, choose between 5 different svg files
  // Rain needs to come before snow in case the weather happens to have both, so that the house gets the snow graphic
  let rainMagnitude;
  if (weather.includes("drizzle") || weather.includes("rain") || weather.includes("shower")) {
    if (weather.includes("light"))
      rainMagnitude = 1;
    else if (weather.includes("heavy"))
      rainMagnitude = 3;
    else if (weather.includes("very heavy"))
      rainMagnitude = 4;
    else if (weather.includes("extreme"))
      rainMagnitude = 5;
    else
      rainMagnitude = 2;

    rainLayer.style = `
      background: url(images/rain-${rainMagnitude}.svg);
      animation: rain 0.8s linear infinite;
      opacity: 0.7;`;
    houseLayer.style = `background: url(images/house-wet.svg) no-repeat;`;
  }
  else {
    rainMagnitude = 0;
    rainLayer.style = `
      animation: none;
      opacity: 0;`;
    houseLayer.style = `background: url(images/house.svg) no-repeat;`;
  }

  // Snow layer, choose between 3 different svg files or invisibility
  let snowMagnitude;
  if (weather.includes("snow") || weather.includes("sleet")) {
    if (weather.includes("light"))
      snowMagnitude = 1;
    else if (weather.includes("heavy"))
      snowMagnitude = 3;
    else
      snowMagnitude = 2;

    snowLayer.style = `
      background: url(images/snow-${snowMagnitude}.svg);
      animation: snowing 3s linear infinite;
      opacity: 0.7;`;
    houseLayer.style = `background: url(images/house-snow-${snowMagnitude}.svg) no-repeat;`;
  }
  else {
    snowMagnitude = 0;
    snowLayer.style = `
      animation: none;
      opacity: 0;`;
    // Don't make the house dry unless you know for sure that there is no snow and no rain
    if (rainMagnitude == 0)
      houseLayer.style = `background: url(images/house.svg) no-repeat;`;

  }

  // Wind layer, 5 speeds for the wind animation or invisibility
  const windMagnitude = (wind >= 3) + (wind >= 10) + (wind >= 16) + (wind >= 20) + (wind >= 25);
  if (windMagnitude > 0) {
    windLayer.style = `
      animation: wind ${9 / wind}s linear infinite;
      opacity: 0.15;`;

    // Have the wind animation effect the snow and rain layers when they are also animating
    // This needs to come after the snow and rain CSS are already set so that this overwrites it
    if (snowMagnitude > 0)
      snowLayer.style = `
        background: url(images/snow-${snowMagnitude}.svg);
        opacity: 0.7;
        animation: snowing 3s linear infinite;
        transform: rotate(${-1.35 * wind}deg) translate(-170px, -220px);;`;

    if (rainMagnitude > 0)
      rainLayer.style = `
        background: url(images/rain-${rainMagnitude}.svg);
        opacity: 0.7;
        animation: rain 0.8s linear infinite;
        transform: rotate(${-1.35 * wind}deg) translate(-170px, -220px);`;
  }
  else
    windLayer.style = `
    animation: none;
    opacity: 0;`;

  // Desaturate the sky if it's really cloudy or snowing
  if (snowMagnitude > 0 || cloudMagnitude == 5)
    desaturationLayer.style = `
      opacity: 0.5;`;
  else
    desaturationLayer.style = `
      opacity: 0;`;
}

function addClickEventListenersToCityButtons(cityData)
{
  for (i = 0; i < TOTAL_CITIES; i++)
    clickedCityAction(i, cityData);
}
const clickedCityAction = (i, cityData) =>
  cityData.buttons[i].addEventListener("click", () =>
  {
    // let date, utcHour, localHourMilitary, localHourAMPM, animationDirection;

    fetch(cityData.urls[i])
    .then(data => data.json())
    .then(data => {retreiveDataFromAPI(cityData, data); })
    .then(data => {updateTextArea(cityData); })
    .then(data => {animateScene(cityData); })
    .catch(err => {
      console.log("There was an error:", err);
      writeToPage("There was an error");
    })
  });

function addHoverEventListenersToCityButtons(cityData) {
  for (i = 0; i < TOTAL_CITIES; i++)
    hoveredCityAction(i, cityData);
}
const hoveredCityAction = (i, cityData) =>
  cityData.buttons[i].addEventListener("mouseenter", () => {
    let cityName = formatCityNameForHover(htmlIds[i]);
  cityNameDisplayed.innerHTML = cityName;
  });



function main()
{
  const background = document.querySelector("body");
  // setupContainingUL();

  cityData = {
    name: "",
    longitude: "",
    latitude: "",
    humidity: "",
    pressure: "",

    clouds: "",
    rain: "",
    snow: "",
    temperature: "",
    visibility: "",
    weather: "", // with this I don't need a variable for thunder
    wind: "",
    previousTimezone: "",
    timezone: "",
    dayLength: "",

    buttons: new Array(TOTAL_CITIES),
    urls: new Array(TOTAL_CITIES)
  }

  cityDataDebug = {
    name: "-",
    longitude: "-",
    latitude: "-",
    humidity: "-",
    pressure: "-",

    clouds: "",
    rain: "",
    snow: "",
    temperature: "",
    visibility: "",
    weather: "", // with this I don't need a variable for thunder
    wind: "",
    previousTimezone: "",
    timezone: "",
    dayLength: "",

    buttons: new Array(TOTAL_DEBUG_CASES)
  }

  setQuerySelectors(cityData);
  setCityURLs(cityData);
  addClickEventListenersToCityButtons(cityData);
  addHoverEventListenersToCityButtons(cityData);

  setDebugQuerySelectors(cityDataDebug);
  addClickEventListenersToCityDebugButtons(cityDataDebug);


  // for(i = 0; i < 148; i++)
  // {
  //   console.log(`#${htmlIds[i]} {`);
  //   console.log("  grid-column-start: ;");
  //   console.log("  grid-row-start: ;");
  //   console.log("}");
  // }
  // console.log(`<img src="images/circle.svg" id="${htmlIds[i]}">`);
}

main();
