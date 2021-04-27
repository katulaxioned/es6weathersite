let searchButton = document.querySelector("header .form-element input[type='submit']");
let tempTitle = document.querySelector(".temp-title");

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
    let makePromise = () => {
      return new Promise((resolve,reject) => {
        const xmlObj = new XMLHttpRequest();
        xmlObj.open('GET',`https://api.openweathermap.org/data/2.5/weather?q=${textValue}&appid=${apiKey}`);
        xmlObj.onload = () => { // This function handle the request.
          resolve(xmlObj.responseText)
        }; 
        xmlObj.onerror = () => {
          reject(new Error("Please enter proper city name"))
        }
        xmlObj.send();
      })
    }
    async function doWork() {
      try{
        const result = await makePromise();
        const resultObj = JSON.parse(result);
        console.log(resultObj)
      }catch (err){
        console.log(err)
      }
    }
    doWork();
  }
}

searchButton.addEventListener('click', searchWeather);