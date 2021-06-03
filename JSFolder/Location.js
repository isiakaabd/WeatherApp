
// current Location

export default class CurrentLoc  {
constructor(){
    this.name = "Current Location";
    this.lat ="";
    this.lon= "";
    this.unit = "imperial"
}


get Name (){
    return this.name
}

set setName (name){
    this.name = name
}
get Lat (){
    return this.lat
}

set setLat (lat){
    this.lat = lat
}
get Lon (){
    return this.lon
}

set setLon (lon){
    this.lon = lon
}
get Unit (){
    return this.unit
}

set setUnit (unit){
    this.unit = unit
}

toggleUnit(){
  this.unit = this.unit  === "imperial" ? "metric" :"imperial"
}

}



export const setCurrentLocation=(myLoc, myCoordObj)=>{
    const {lat, lon,name, unit} = myCoordObj;
    myLoc.setLat = lat;
    myLoc.setLon = lon;
    myLoc.name = name;
    if(unit){
        myLoc.setUnit = unit
    }
  
}


