let searchButton = document.querySelector("header .form-element input[type='submit']");
let tempTitle = document.querySelector(".temp-title");
let resutlDiv = document.querySelector(".weather .wrapper .result-div")
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const apiKey = '5a23d8283cd00609e5130d95f233af52'; // Stored api key.

let searchWeather = (e) => {
  e.preventDefault()
  let textValue = document.querySelector("header .form-element input[name='search']").value ; // Get value that user enter.
  let regex = /[^a-zA-Z, ]+/g; // To check text is proper city name or not.
  
  // validation
  if(textValue === ""){
    tempTitle.textContent = "City name can't be null!";
  } else if(regex.test(textValue)){
    tempTitle.textContent = "Please enter proper city name";
  } else {
    tempTitle.textContent = ""; // This clear error everytime.
    resutlDiv.textContent = "" // This clear screen everytime.
    let searchCityArray = textValue.split(","); // Take entered city string and convert into array.

    let promiseForLatLon = (cityName) => { // This promise get lat and lon of typed city so we can call next api with them.
      return new Promise((resolve,reject) => {
        const xmlObj = new XMLHttpRequest();
        xmlObj.open('GET',`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`);
        xmlObj.onload = () => { // This function handle the request.
          resolve(xmlObj.responseText)
          if(xmlObj.status !== 200){
            tempTitle.textContent = "Please enter proper city name!"
            reject("Please enter proper city name!")
            return false;
          }
        }; 
        xmlObj.onerror = () => {
          reject(new Error("Please enter proper city name"))
        }
        xmlObj.send();
      })
    }
    let promiseForResult = (lat,lon) => { // This promise gives us info about current weather and next 5 days weather.
      return new Promise((resolve, reject) => {
        const requestObj = new XMLHttpRequest();
        requestObj.open('GET',`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${apiKey}`)
        requestObj.onload = () => {
          resolve(requestObj.responseText)
        };
        requestObj.onerror = () => {
          reject(new Error("Please enter proper city name"))
        }
        requestObj.send();
      })
    }

    const doWork = async () => {
      try{
        Promise.all(searchCityArray.map(async (city) => {
          const cityResult = await promiseForLatLon(city);
          const cityResultObj = JSON.parse(cityResult);
          // const cityName = cityResultObj.name;
          const lat = cityResultObj.coord.lat;
          const lon = cityResultObj.coord.lon;
          const weatherResult = await promiseForResult(lat,lon);
          const weatherResultObj = JSON.parse(weatherResult)
          let html = "";
          const result = document.createElement('div') // Create element to store results.
          result.classList.add("result");

          // Time code.
          let date = new Date();
          let hours = date.getHours();
          let minutes = date.getMinutes();
          let ampm = hours >= 12 ? 'pm' : 'am';
          hours = hours % 12;
          hours = hours ? hours : 12; // the hour '0' should be '12'
          minutes = minutes < 10 ? '0'+minutes : minutes;
          let strTime = `${hours}:${minutes}`;

          let findWeatherImage = (condition) => {
            switch (condition) { // Function for change image depend upon weather condition.
              case "Drizzle":
                return "assets/images/icon-13.svg";  
              break;
              case "Thunderstorm":
                return "assets/images/icon-12.svg";
              break;
              case "Rain":
                return "assets/images/icon-14.svg";
              break;
              case "Clear":
                return "assets/images/icon-1.svg";  
              break;
              case "Broken clouds":
                return "assets/images/icon-3.svg";
              break;
              case "Clouds":
                return "assets/images/icon-5.svg";
              break;
              case "Mist":
                return "assets/images/icon-7.svg";
              break;
              case "Smoke":
                return "assets/images/icon-7.svg";
              break;
              case "Haze":
                return "assets/images/icon-7.svg";
              break;
              default: return "assets/images/icon-1.svg";
                break;
            }
          }

          let findDay = (dayIndex, IncrimentCounter) => { // This function return day as per IncrimentCounter.
            let total = dayIndex + IncrimentCounter
            if(total > 6){
              return days[total - 7]
            }
            return days[total];
          }

          html += `
          <div class="one-day-info">
            <ul class="name-time-info">
              <li class="city-name">${cityResultObj.name}</li>
              <li class="time">${strTime}<span class="time-unit">${ampm}</span></li>
              <li class="day">${date.toLocaleString('default', {weekday:'short'})}</li>
              <li class="date">${date.toLocaleString('default', {month:'short'})} ${date.getDate()}</li>
              <li>
                <img src="${findWeatherImage(weatherResultObj.current.weather[0].main)}" alt="Weather image" />
              </li>
              <li>${Math.round(weatherResultObj.current.temp - 273.15)}&deg;</li>
            </ul>
          </div>
          <div class="five-day-info">
            <ul class="each-day">
              <li class="fiveday-day">${findDay(date.getDay(),1)}</li>
              <li class="fiveday-img">
                <img src="${findWeatherImage(weatherResultObj.daily[0].weather[0].main)}" alt="Weather image" />
              </li>
              <li class="fiveday-temp">${Math.round(weatherResultObj.daily[0].temp.min - 273.15)}&deg;</li>
              <li>humidity</li>
              <li class="humidity-result">${weatherResultObj.daily[0].humidity}&deg;</li>
            </ul>
            <ul class="each-day">
              <li class="fiveday-day">${findDay(date.getDay(),2)}</li>
              <li class="fiveday-img">
                <img src="${findWeatherImage(weatherResultObj.daily[1].weather[0].main)}" alt="Weather image" />
              </li>
              <li class="fiveday-temp">${Math.round(weatherResultObj.daily[1].temp.min - 273.15)}&deg;</li>
              <li>humidity</li>
              <li class="humidity-result">${weatherResultObj.daily[1].humidity}&deg;</li>
            </ul>
            <ul class="each-day">
              <li class="fiveday-day">${findDay(date.getDay(),3)}</li>
              <li class="fiveday-img">
                <img src="${findWeatherImage(weatherResultObj.daily[2].weather[0].main)}" alt="Weather image" />
              </li>
              <li class="fiveday-temp">${Math.round(weatherResultObj.daily[2].temp.min - 273.15)}&deg;</li>
              <li>humidity</li>
              <li class="humidity-result">${weatherResultObj.daily[2].humidity}&deg;</li>
            </ul>
            <ul class="each-day">
              <li class="fiveday-day">${findDay(date.getDay(),4)}</li>
              <li class="fiveday-img">
                <img src="${findWeatherImage(weatherResultObj.daily[3].weather[0].main)}" alt="Weather image" />
              </li>
              <li class="fiveday-temp">${Math.round(weatherResultObj.daily[3].temp.min - 273.15)}&deg;</li>
              <li>humidity</li>
              <li class="humidity-result">${weatherResultObj.daily[3].humidity}&deg;</li>
            </ul>
            <ul class="each-day">
              <li class="fiveday-day">${findDay(date.getDay(),5)}</li>
              <li class="fiveday-img">
                <img src="${findWeatherImage(weatherResultObj.daily[4].weather[0].main)}" alt="Weather image" />
              </li>
              <li class="fiveday-temp">${Math.round(weatherResultObj.daily[4].temp.min - 273.15)}&deg;</li>
              <li>humidity</li>
              <li class="humidity-result">${weatherResultObj.daily[4].humidity}&deg;</li>
            </ul>
          </div>`
          result.innerHTML = html
          resutlDiv.appendChild(result)
        }))
      }catch (err){
        console.log(err)
      }
    }
    doWork();
  }
}

searchButton.addEventListener('click', searchWeather);