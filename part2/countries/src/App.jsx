import { useState, useEffect } from 'react'
import axios from 'axios'
import Search from './components/Search'
import CountryList from './components/CountryList'
import CountryDetail from './components/CountryDetail'

const App = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setCountries([])
      setSelectedCountry(null)
      return
    }

    axios
      .get(`https://restcountries.com/v3.1/name/${searchTerm}`)
      .then(response => {
        setCountries(response.data)
        setSelectedCountry(null)
      })
      .catch(error => {
        setCountries([])
        setSelectedCountry(null)
      })
  }, [searchTerm])

  if (selectedCountry) {
    return (
      <div>
        <h1>Find countries</h1>
        <Search searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <button onClick={() => setSelectedCountry(null)}>Back</button>
        <CountryDetail country={selectedCountry} />
      </div>
    )
  }

  if (searchTerm.trim() === '') {
    return (
      <div>
        <h1>Find countries</h1>
        <Search searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      </div>
    )
  }

  if (countries.length > 10) {
    return (
      <div>
        <h1>Find countries</h1>
        <Search searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <p>Too many matches, specify another filter</p>
      </div>
    )
  }

  return (
    <div>
      <h1>Find countries</h1>
      <Search searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <CountryList countries={countries} onSelectCountry={setSelectedCountry} />
    </div>
  )
}

export default App