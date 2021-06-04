// import {geoError} from "./display.js";
import CurrentLoc, { setCurrentLocation } from './Location.js'
import {
  cleanText,
  animateIcon,
  errorDisplay,
  getWeather,
  updateDisplay,
  getDataFromAPI,
} from './display.js'

const myLoc = new CurrentLoc()

window.addEventListener('load', () => initApp())
// DOMContentloaded
const initApp = () => {
  const searchForm = document.getElementById('searchForm')
  const mapIcon = document.querySelector('.fa-map-marker');
  
  //const searchbtn = document.getElementById("search-input").value

  mapIcon.addEventListener("click", ()=>getWeatherOnLoad())
  searchForm.addEventListener('submit', searchNewlocation)

  getWeatherOnLoad()
}

const getWeatherOnLoad = () => {
  if (navigator.geolocation)
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError)
  else geoError()
}

const geoSuccess = (position) => {
  const myCoordObj = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
    name: `lat:${position.coords.latitude} Lon :${position.coords.longitude}`,
  }
  setCurrentLocation(myLoc, myCoordObj)
  updateAndDisplay(myLoc)
}

const updateAndDisplay = async (myLoc) => {
  const weatherJSON = await getWeather(myLoc)
  
  //    console.log(weatherJSON)
  if (weatherJSON) {
 
  updateDisplay(weatherJSON, myLoc)
}
}
const geoError = (errObj) => {
  var message = ' '
  if (errObj.code === 2) message = 'Check your Network Connection'

  if (errObj.code === 1) message = errObj.message

  errorDisplay(message)
}

async function searchNewlocation(e) {
  e.preventDefault()
  const searchBox = document.getElementById('search-input')

  const element = document.getElementById('search-icon')
  

   animateIcon(element)
  const searchText = searchBox.value
  const TextValue = cleanText(searchText)
  const coordsData = await getDataFromAPI(TextValue);
  if (coordsData) {
    if (coordsData.cod == 200) {
      const mapIcon = document.querySelector('.fa-map-marker');
     mapIcon.classList.toggle("none")
      const myCoordObj = {
        lat: coordsData.coord.lat,
        lon: coordsData.coord.lon,
        name: ` lat:${coordsData.coord.lat} lon:${coordsData.coord.lat}`,
      }
      setCurrentLocation(myLoc, myCoordObj)
      updateAndDisplay(myLoc, coordsData)
    } 
  if(coordsData.cod == 400) return errorDisplay("Enter a search keyword")
    else errorDisplay(coordsData.message)
  }else errorDisplay("connection Error")
}

