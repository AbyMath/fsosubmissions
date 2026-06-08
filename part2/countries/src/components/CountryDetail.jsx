import { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null)
  const api_key = import.meta.env.VITE_OPENWEATHER_KEY

  useEffect(() => {
    if (!capital || !api_key) return

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${api_key}`
      )
      .then(response => {
        setWeather(response.data)
      })
      .catch(error => {
        console.log('Weather fetch failed')
      })
  }, [capital, api_key])

  if (!weather) {
    return <p>Loading weather...</p>
  }

  const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`

  return (
    <div>
      <h3>Weather in {capital}</h3>
      <p><strong>Temperature:</strong> {weather.main.temp} °C</p>
      <p><strong>Weather:</strong> {weather.weather[0].main}</p>
      <p><strong>Wind:</strong> {weather.wind.speed} m/s</p>
      <img src={iconUrl} alt={weather.weather[0].description} />
    </div>
  )
}

const CountryDetail = ({ country }) => {
  const capital = country.capital ? country.capital[0] : null
  const languages = country.languages ? Object.values(country.languages).join(', ') : 'N/A'
  const flagUrl = country.flags.svg

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p><strong>Capital:</strong> {capital}</p>
      <p><strong>Area:</strong> {country.area} km²</p>
      <p><strong>Languages:</strong> {languages}</p>
      <img src={flagUrl} alt={`Flag of ${country.name.common}`} style={{ width: '100px' }} />
      {capital && <Weather capital={capital} />}
    </div>
  )
}

export default CountryDetail