const Search = ({ searchTerm, onSearchChange }) => (
  <div>
    <input
      type="text"
      placeholder="Search for a country..."
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
    />
  </div>
)

export default Search