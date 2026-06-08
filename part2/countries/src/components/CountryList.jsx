const CountryList = ({ countries, onSelectCountry }) => (
  <div>
    {countries.map(country => (
      <div key={country.cca2} style={{ marginBottom: '10px' }}>
        {country.name.common}
        <button style={{ marginLeft: '10px' }}>
          <span onClick={() => onSelectCountry(country)}>show</span>
        </button>
      </div>
    ))}
  </div>
)

export default CountryList