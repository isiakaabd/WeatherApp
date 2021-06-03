
// import {geoError} from "./display.js";
import  CurrentLoc, {setCurrentLocation} from "./Location.js";
import {cleanText, animateIcon, errorDisplay, getWeather,updateDisplay} from "./display.js"




const myLoc = new CurrentLoc()

window.addEventListener("load",() => initApp() )
// DOMContentloaded
const initApp = ()=>{
    const searchForm = document.getElementById("searchForm")
    //const searchbtn = document.getElementById("search-input").value

  //searchForm.addEventListener("submit", ()=>searchNewlocation())
  searchForm.addEventListener("submit", (e) =>{
      e.preventDefault()
      const searchBox = document.getElementById("search-input")
    
      const  element =  document.getElementById("search-icon")
      animateIcon(element)
      const  searchText = searchBox.value;
      const TextValue = cleanText(searchText)

      console.log(TextValue)
    }, {once: true})
    getWeatherOnLoad()
}


const getWeatherOnLoad = ()=>{

    if(navigator.geolocation)  navigator.geolocation.getCurrentPosition(geoSuccess, geoError)  
     else  geoError();
      
   
    
}



const geoSuccess = (position)=>{

    const myCoordObj= {
     lat :  position.coords.latitude,
     lon : position.coords.longitude,
     name: `lat:${position.coords.latitude} Lon :${position.coords.longitude}`

    }
    setCurrentLocation(myLoc, myCoordObj)
    updateAndDisplay(getWeather,myLoc)
}

const updateAndDisplay =  async (getWeather)=>{
   const weatherJSON= await getWeather(myLoc)
   console.log(weatherJSON)
   if (weatherJSON)  updateDisplay(weatherJSON,myLoc)
}
    

const geoError = (errObj)=>{
    
        var message =" "
    if (errObj.code === 2) {
        message = "Check your Network Connection"
    }
    if (errObj.code === 1){
        message = errObj.message
    }  
        errorDisplay(message)
        
    }

  
    // search for location



    const searchNewlocation =  (e)=>{
     
        
       
    
    }



    