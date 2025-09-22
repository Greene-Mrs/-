import axios from 'axios'
const apiKey = '3a7bfebc57454ef78ca1579320335288'

//天气实况

export const getWeather = (coordinate) => {
    const weatherUrl =
    'https://nr46gyxjy8.re.qweatherapi.com/v7/weather/now?location=' +coordinate[0] +',' +coordinate[1]
    
    return axios.get(weatherUrl, {
    headers: {
      'X-QW-Api-Key': apiKey
    }
  })
}

//天气预报
export const getWeatherDay = (coordinate) => {
  const weatherDayUrl =
    'https://nr46gyxjy8.re.qweatherapi.com/v7/weather/7d?location=' +
    coordinate[0] +
    ',' +
    coordinate[1]
  return axios.get(weatherDayUrl, {
    headers: {
      'X-QW-Api-Key': apiKey
    }
  })
}

//天气预警
export const getDisaster = (coordinate) => {
  const disasterUrl =
    'https://nr46gyxjy8.re.qweatherapi.com/v7/warning/now?location=' +
    coordinate[0] +
    ',' +
    coordinate[1]
  return axios.get(disasterUrl, {
    headers: {
      'X-QW-Api-Key': apiKey
    }
  })
}