import APIkey from './APIkey.js'

export const errorDisplay = (headerMsg) => {
  updateWeather(headerMsg)
}

const updateWeather = (message) => {
  const today = document.getElementById('networkError')
  today.classList.toggle('none')
  today.textContent = message
}

export const animateIcon = (element) => {
  animate(element)
  setTimeout(animate, () => 1000)
}

const animate = (element) => {
  element.classList.toggle('none')
  element.nextElementSibling.classList.toggle('block')
  element.nextElementSibling.classList.toggle('none')
}

export const cleanText = (text) => {
  const regex = /\s+/gi
  return text.replaceAll(regex, ' ').trim()
}

export const getWeather = async (myLoc) => {
  const lat = myLoc.Lat
  const lon = myLoc.Lon
  const unit = 'metric'
  const part = 'minutely,hourly'
  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${unit}&exclude=${part}&appid=${APIkey}`
  //`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&units=${unit}&lon=${lon}&appid=${APIkey}`

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

// console.log(dateObj())
export const updateDisplay = (weatherJSON, myLoc) => {
  const weatherClass = getWeatherClass(weatherJSON.current.weather[0].icon)
  setBGimage(weatherClass)
  // updateWeather('Today')
  // setting todays date
  setTodaysDate('small', dateObj())
  const currentCondtion = createCurrentCondition(weatherJSON, myLoc.Unit)
  //displayCurrentCondition(currentCondtion, weatherJSON)
  const weather = weatherelement(currentCondtion, weatherJSON)
  const secondContainer = document.querySelector('.secondContainer')
  secondContainer.append(weather)
  // six days forecast
  createSixDaysForecast(weatherJSON)
}

const setBGimage = (weatherClass) => {
  const body = document.documentElement.firstElementChild.nextElementSibling
  body.classList.forEach((img) => {
    if (img !== weatherClass) {
      body.classList.remove(img)
      body.classList.add(weatherClass)
    }
  })
}

const createCurrentCondition = (weatherClass) => {
  console.log(weatherClass.current.temp)
  // const tempUnit = unit === 'imperial' ? 'F' : 'C'
  // const windUnit = unit === 'imperial' ? 'mph' : 'm/s'
  const icon = iconMainDiv(
    weatherClass.current.weather[0].icon,
    weatherClass.current.weather[0].description,
  )
  const main = weatherClass.current
  const sys = weatherClass.timezone
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
  } = main
  const { country } = sys
  const { min, max } = weatherClass.daily[0].temp
  //const { speed } = weatherClass.current.wind_speed
  const temps = roundedNumber(temp)
  const feels = roundedNumber(feels_like)
  const minTemp = roundedNumber(min)
  const maxTemp = roundedNumber(max)
  const humidityValue = roundedNumber(humidity)
  const windValue = roundedNumber(wind_speed)
  const visibilityValue = visibility
  const name = weatherClass.name
  const countryText = country
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
const toProperCase = (item) => {
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

const displayCurrentCondition = (currentCondtion, weatherJSON) => {
  const getDays = new Date()
  const date = getDays.getHours()
  console.log(currentCondtion)
  // const temps = document.getElementById('temp')
  // const feelsText = document.getElementById('value')
  // const humidityText = document.getElementById('humidity')
  // const windText = document.getElementById('wind')
  // const visibilityText = document.getElementById('visibility')
  // const name = document.getElementById('name')
  // const country = document.getElementById('country')
  // const sunrise = document.getElementById('sunrise')
  // const weekdays = document.getElementById('weekdays')
  // const currentday = document.getElementById('currentday')
  // const minCurrentday = document.getElementById('minCurrentday')
  // const weatherIcon = document.getElementById('weather-icon')
  // const currentDescription = document.getElementById('current-description')

  //
}
const weatherelement = (currentCondtion, weatherJSON) => {
  const generalContainer = document.createElement('div')
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
  // const countrylocation =createEle("span", "country","p",currentCondtion[2]);
  const edit = createEle('i', 'fas fa-edit', 'p')
  location.appendChild(namelocation, edit)
  locationContainer.append(weatherValue)
  // locationContainer.append()

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
  generalContainer.append(container, locationContainer, feelsLike)
  return generalContainer
}

const getSunRIseOrSet = (weatherJSON, currentCondtion) => {
  var currentsunValue = ''
  const z = weatherJSON.current.dt
  const y = weatherJSON.current.sunrise
  if (convertDateValue(z) < convertDateValue(y))
    currentsunValue = `Sunset ${currentCondtion[12]}`
  else currentsunValue = `Sunrise ${currentCondtion[11]} `
  return currentsunValue
}

const ToHours = (value) => {
  const timeValue = value
  const date = convertDateValue(timeValue)
  let hours = date.getHours()
  const min = date.getMinutes()
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
  ele.append(IconDiv)
  // high and low temp container
  const highContainer = document.createElement('div')
  const high = document.createElement('div')
  const low = document.createElement('div')
  high.textContent = highValue
  low.textContent = lowValue
  high.className = 'high'
  low.className = 'low'

  highContainer.appendChild(high)
  highContainer.appendChild(low)

  ele.append(highContainer)

  return ele
}

// helper function to create element
const createEle = (type, classname, tempValue, textcontent) => {
  const element = document.createElement(type)
  element.className = classname
  element.innerHTML = textcontent
  if (tempValue === 'temp') element.innerHTML = `${textcontent}°C`

  return element
}
