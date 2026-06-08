const Filter = (props) => (
  <div>
    Filter shown with: <input value={props.searchTerm} onChange={(e) => props.onSearchChange(e.target.value)} />
  </div>
)

export default Filter