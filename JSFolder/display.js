import APIkey from './APIkey.js'

export const errorDisplay = (headerMsg) => {
  updateWeather(headerMsg)
}

const updateWeather = (message) => {
  const networkError = document.getElementById('networkError')
  networkError.classList.remove('none')
  networkError.textContent = message
}

export const animateIcon = (element) => {
  animate(element)
  setTimeout(animate, 1000, element)
}

const animate = (ele) => {
  ele.classList.toggle('none')
  ele.nextElementSibling.classList.toggle('block')
  ele.nextElementSibling.classList.toggle('none')
}

export const cleanText = (text) => {
  const regex = /\s+/gi
  return text.replaceAll(regex, ' ').trim()
}

//
export const getDataFromAPI = async (TextValue) => {
  const regex = /^\d+$/
  const units = 'metric'
  const z = regex.test(TextValue)
  const flag = z ? 'zip' : 'q'

  const url = `https://api.openweathermap.org/data/2.5/weather?${flag}=${TextValue}&units=${units}&appid=${APIkey}`

  const encodeUrl = encodeURI(url)

  try {
    const fetchURL = await fetch(encodeUrl)
    const dataJson = await fetchURL.json()
    return dataJson
  } catch (error) {
    alert(error)
    errorDisplay(error.message)
  }
}

export const getWeather = async (myLoc) => {
  const lat = myLoc.Lat
  const lon = myLoc.Lon
  const unit = 'metric'
  const part = 'minutely,hourly'
  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${unit}&exclude=${part}&appid=${APIkey}`

  try {
    const weather = await fetch(url)
    const dataJson = await weather.json()
    return dataJson
  } catch (error) {
    console.error(error)
  }
}

const getWeatherClass = (icon) => {
  const firstTwoChar = icon.slice(0, 2)
  const lastChar = icon.slice(2)
  const weatherLookUp = {
    '09': 'snow',
    '10': 'rain',
    '11': 'rain',
    '13': 'snow',
    '50': 'fog',
  }
  let classWeather
  if (weatherLookUp[firstTwoChar]) {
    classWeather = weatherLookUp[firstTwoChar]
  } else if (lastChar === 'd') {
    classWeather = 'clouds'
  } else classWeather = 'night'
  return classWeather
}

export const updateDisplay = (weatherJSON, myLoc) => {
  fadeIn()
  clearDisplay()
  const weatherClass = getWeatherClass(weatherJSON.current.weather[0].icon)
  setBGimage(weatherClass)

  // setting todays date
  setTodaysDate('small', dateObj())

  // Tavle containing different items
  const currentCondtion = createCurrentCondition(weatherJSON, myLoc)
  const weather = weatherelement(currentCondtion, weatherJSON, myLoc)
  const secondContainer = document.querySelector('.secondContainer')
  secondContainer.append(weather)

  const gridSystems = gridSystem(currentCondtion, weatherJSON)
  const grid = document.querySelector('.gridsystem')
  grid.append(gridSystems)
  // six days forecast
  createSixDaysForecast(weatherJSON)
  fadeIn()
}

const fadeIn = () => {
  const secondContainer = document.querySelector('.secondContainer')
  secondContainer.classList.toggle('.noVisibility')
  secondContainer.classList.toggle('.fade-in')
  const currentgrid = document.querySelector('.gridsystem')
  currentgrid.classList.toggle('.noVisibility')
  currentgrid.classList.toggle('.fade-in')
  const cc = document.querySelector('.seven-days')
  cc.classList.toggle('.noVisibility')
  cc.classList.toggle('.fade-in')
}
// to remove the last child
const clearDisplay = () => {
  const secondContainer = document.querySelector('.secondContainer')
  deleteContents(secondContainer)

  const currentDataInfo = document.querySelector('.grid')
  deleteContents(currentDataInfo)

  const sevendays = document.querySelector('.row-div')
  deleteContents(sevendays)
}

const deleteContents = (parementElem) => {
  let child = parementElem.lastElementChild
  while (child) {
    parementElem.removeChild(child)
    child = parementElem.lastElementChild
  }
}

// setting background images
const setBGimage = (weatherClass) => {
  const body = document.documentElement.firstElementChild.nextElementSibling
  body.classList.forEach((img) => {
    if (img !== weatherClass) {
      body.classList.remove(img)
      body.classList.add(weatherClass)
    }
  })
}

// current weather condition

const createCurrentCondition = (weatherClass, myLocation) => {
  //  icon
  const icon = iconMainDiv(
    weatherClass.current.weather[0].icon,
    weatherClass.current.weather[0].description,
  )
  const main = weatherClass.current
  const { description } = weatherClass.daily[0].weather[0]
  const {
    temp,
    dt,
    feels_like,
    humidity,
    sunrise,
    sunset,
    wind_speed,
    visibility,
    uvi,
  } = main
  // weather item
  const { min, max } = weatherClass.daily[0].temp
  const temps = roundedNumber(temp)
  const feels = roundedNumber(feels_like)
  const minTemp = roundedNumber(min)
  const maxTemp = roundedNumber(max)
  const humidityValue = roundedNumber(humidity)
  const windValue = roundedNumber(wind_speed)
  const visibilityValue = visibility
  const name = myLocation.lat
  const countryText = myLocation.lon
  const sunriseValue = ToHours(sunrise)
  const sunsetValue = ToHours(sunset)
  const descr = toProperCase(weatherClass.timezone)

  return [
    icon,
    temps,
    descr,
    feels,
    minTemp,
    maxTemp,
    humidityValue,
    windValue,
    visibilityValue,
    name,
    countryText,
    sunriseValue,
    sunsetValue,
    dt,
    description,
    uvi,
  ]
}

const iconMainDiv = (icon, description) => {
  const FaIcons = TranslatetoFontAwesome(icon)
  FaIcons.title = description
  FaIcons.ariaHidden = true
  FaIcons.classList.add('fa-2x')
  return FaIcons
}

const roundedNumber = (value) => {
  return `${Math.round(Number(value))}`
}

// proper case
export const toProperCase = (item) => {
  const splitedItem = item.split(' ')
  const capitalizedItem = splitedItem.map((item) => {
    return item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()
  })
  return capitalizedItem.join(' ')
}

// fontawesome
const TranslatetoFontAwesome = (icon) => {
  const firstTwoChar = icon.slice(0, 2)
  const lastChar = icon.slice(2)
  const i = document.createElement('i')
  if (firstTwoChar == '01') {
    if (lastChar === 'd') i.classList.add('fas', 'fa-sun')
    else i.classList.add('far', 'fa-moon')
  }

  if (firstTwoChar == '02') {
    if (lastChar === 'd') i.classList.add('fas', 'fa-cloud-sun')
    else i.classList.add('fas', 'fa-cloud-moon')
  }

  if (firstTwoChar == '03') {
    i.classList.add('fas', 'fa-cloud')
  }
  if (firstTwoChar == '04') {
    i.classList.add('fas', 'fa-cloud-meatball')
  }
  if (firstTwoChar == '09') {
    i.classList.add('fas', 'fa-cloud-rain')
  }
  if (firstTwoChar == '10') {
    if (lastChar === 'd') i.classList.add('fas', 'fa-cloud-sun-rain')
    else i.classList.add('fas', 'fa-cloud-moon-rain')
  }
  if (firstTwoChar == '11') {
    i.classList.add('fas', 'fa-poo-storm')
  }
  if (firstTwoChar == '13') {
    i.classList.add('far', 'fa-snowflake')
  }
  if (firstTwoChar == '50') {
    i.classList.add('fas', 'fa-smog')
  }
  return i
}

const weatherelement = (currentCondtion, weatherJSON, myLoc) => {
  const generalContainer = document.createElement('div')
  generalContainer.className = 'currentDataInfo'
  const container = document.createElement('div')
  container.className = 'm-right d-flex justify-content-center mt-3 mb-2 day'
  // weather icon
  const weatherIcon = createEle(
    'div',
    'weather-icon align-self-center mr-2',
    'div',
    null,
  )
  weatherIcon.append(currentCondtion[0])

  // today icon
  const container2 = document.createElement('div')

  const todayIcon = createEle('p', 'today mb-0', 'div', 'Today')
  const small = createEle('small', 'small', 'div', dateObj())
  todayIcon.id = 'today'

  container2.append(todayIcon, small)
  container.append(weatherIcon, container2)

  const locationContainer = createEle(
    'div',
    'd-flex justify-content-center',
    'div',
    null,
  )
  const weatherValue = createEle('div', 'temp', 'temp', currentCondtion[1])
  const location = createEle(
    'p',
    'location text-center',
    'p',
    currentCondtion[9],
  )
  const namelocation = createEle('span', 'name', 'p', currentCondtion[2])
  const edit = createEle('i', 'fas fa-edit', 'p')
  location.appendChild(namelocation, edit)
  locationContainer.append(weatherValue)


  const feelsLike = createEle(
    'p',
    'text-center feels mt-2 mb-1',
    'p',
    'feels like ',
  )
  const value = createEle('span', 'value', 'p', currentCondtion[3])
  const round = createEle('span', 'round', 'p', null)
  const sunrise = createEle(
    'span',
    'sunrise',
    'p',
    getSunRIseOrSet(weatherJSON, currentCondtion),
  )
  feelsLike.append(value, round, sunrise)
  const latLon = createEle('div', 'latLon', null, `${myLoc.name}`)
  generalContainer.append(container, locationContainer, feelsLike, latLon)
  return generalContainer
}

const getSunRIseOrSet = (weatherJSON, currentCondtion) => {
  var currentsunValue = ''
  const z = weatherJSON.current.dt
  const y = weatherJSON.current.sunrise
  if (y < z) currentsunValue = `Sunset ${currentCondtion[12]}`
  if (y > z) currentsunValue = `Sunrise ${currentCondtion[11]}`
  return currentsunValue
}

const ToHours = (value) => {
  const timeValue = value
  const date = convertDateValue(timeValue)
  let hours = date.getHours()
  var min = date.getMinutes()
  if(min < 10) min =`0${min}`
  var time = ''
  if (hours > 12) {
    time = 'pm'
    hours = hours - 12
  } else time = 'am'
  return `${hours}:${min}${time}`
}

// converting the date from API
const convertDateValue = (value) => {
  return new Date(value * 1000)
}

// to get actual day in week
const getActualDay = (index) => {
  const weekday = new Array(7)
  weekday[0] = 'Sun'
  weekday[1] = 'Mon'
  weekday[2] = 'Tue'
  weekday[3] = 'Wed'
  weekday[4] = 'Thur'
  weekday[5] = 'Fri'
  weekday[6] = 'Sat'
  return weekday[index]
}
const dateObj = () => {
  const day = getActualDay(new Date().getDay())
  return (
    day + ',' + '' + new Date().toDateString().split(' ').slice(1, 3).join(' ')
  )
}

const setTodaysDate = (item, message) => {
  const ele = document.getElementById(item)
  // ele.textContent = message
}

const convertToDateString = (value) => {
  const currentDate = convertDateValue(value)
  return currentDate.toString().slice(0, 4)
}

const createSixDaysForecast = (weatherJSON) => {
  const sixdays = weatherJSON.daily
  const cc = document.getElementById('rowDiv')
  for (let i = 1; i < sixdays.length; i++) {
    const dateArray = convertToDateString(sixdays[i].dt)
    // const f = date.toString().slice(0, 4)
    cc.appendChild(
      cretaEle(
        dateArray,
        sixdays[i].weather[0].icon,
        sixdays[i].weather[0].description,
        `${roundedNumber(sixdays[i].temp.max)}°`,
        `${roundedNumber(sixdays[i].temp.min)}°`,
      ),
    )
  }
}
//  six day table
const cretaEle = (
  daysItem,
  iconclass,
  icondescirption,
  highValue,
  lowValue,
) => {
  const ele = document.createElement('div')
  ele.className = 'col'
  const day = document.createElement('div')
  day.classList.add('day')
  day.classList.add('day1')

  day.innerHTML = daysItem
  ele.append(day)
  // icon
  const IconDiv = document.createElement('div')
  const w = iconMainDiv(iconclass, icondescirption)
  w.classList.remove('fa-2x')
  TranslatetoFontAwesome(iconclass)
  IconDiv.append(w)

  day.innerHTML = daysItem

  // const openWeatherIcon =  (iconclass, icondescirption)=>{

  //   var img   = new Image();

  //      const url = `http://openweathermap.org/img/wn/${iconclass}.png`;

  //   img.title = icondescirption;
  //   img.alt =icondescirption
  //    img.className = "img"
  //   img.src = url
  //       return  img
  //     }
  // const image = openWeatherIcon(iconclass, icondescirption);
  // ele.append(image)
  // high and low temp container
  const highContainer = document.createElement('div')
  const high = document.createElement('div')
  const low = document.createElement('div')
  high.textContent = highValue
  low.textContent = lowValue
  high.className = 'high'
  low.className = 'low'

  highContainer.append(high, low)

  ele.append(IconDiv, highContainer)

  return ele
}

// helper function to create element
const createEle = (type, classname, tempValue, textcontent) => {
  const element = document.createElement(type)
  element.className = classname
  element.innerHTML = textcontent
  if (tempValue === 'temp') element.innerHTML = `${textcontent}°C`
  if (tempValue === 'wind') element.innerHTML = `${textcontent} m/s`
  if (tempValue === 'humidity') element.innerHTML = `${textcontent}%`
  return element
}

// creating grid

const gridSystem = (currentCondtion, weatherJSON) => {
  const grid1 = createEle(
    'div',
    'grid-item grid-heading',
    null,
    convertToDateString(weatherJSON.current.dt),
  )
  const grid2 = createEle(
    'div',
    'grid-item grid-heading grid2',
    null,
    toProperCase(currentCondtion[14]),
  )
  const grid3 = createEle(
    'div',
    'grid-item grid-heading',
    'temp',
    currentCondtion[3],
  )
  const grid4 = createEle(
    'div',
    'grid-item text-muted',
    'temp',
    currentCondtion[4],
  )
  const grid5 = createEle('div', 'grid-item grid-heading', null, 'Wind')
  const grid6 = createEle(
    'div',
    'grid-item text-muted',
    'wind',
    currentCondtion[7],
  )
  const grid7 = createEle('div', 'grid-item grid-heading', null, 'Humidity')
  const grid8 = createEle(
    'div',
    'grid-item text-muted',
    'humidity',
    currentCondtion[6],
  )
  const grid9 = createEle('div', 'grid-item grid-heading', null, 'Visibility')
  const grid10 = createEle(
    'div',
    'grid-item text-muted',
    null,
    currentCondtion[8],
  )
  const grid11 = createEle('div', 'grid-item grid-heading', null, 'UV')
  const grid12 = createEle(
    'div',
    'grid-item text-muted',
    null,
    currentCondtion[15],
  )

  const gridContainer = document.querySelector('.grid')
  // createEle("div","grid", "div", null);
  gridContainer.append(
    grid1,
    grid2,
    grid3,
    grid4,
    grid5,
    grid6,
    grid7,
    grid8,
    grid9,
    grid10,
    grid11,
    grid12,
  )
  return gridContainer
}

// Icon from open
