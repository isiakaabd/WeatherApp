
// import {geoError} from "./display.js";
import  CurrentLoc, {setCurrentLocation} from "./Location.js";
const searchBox = document.getElementById("search-input")
const searchBtn = document.getElementById("searchBtn")



const myLoc = new CurrentLoc()

window.addEventListener("load",() => initApp() )
// DOMContentloaded
const initApp = ()=>{

    getWeatherOnLoad()
}


const getWeatherOnLoad = ()=>{


    if("geolocation" in navigator){
        navigator.geolocation.getCurrentPosition(showPosition)  
    }else{
        geoError()
    }
}

const showPosition = (position)=>{

    const myCoordObj= {
     lat :  position.coords.latitude,
     lon : position.coords.longitude,
     name: `lat:${position.coords.latitude} Lon :${position.coords.longitude}`

    }
    setCurrentLocation(myLoc, myCoordObj)
    console.log(myLoc)
}


const geoError = (errObj)=>{
    console.log(errObj.msg)
    const errMsg = errObj.message? errObj.message:"Geolocation not surported"
    errorDisplay(errMsg)
    
    }

    searchBtn.addEventListener("click",()=>searchNewlocation())
    // search for location



    const searchNewlocation =(e)=>{
    //  e.preventDefault()
    alert(searchBox.value)
    }
    