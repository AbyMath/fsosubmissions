const PersonForm = (props) => (
  <form onSubmit={props.onSubmit}>
    <div>
      name: <input value={props.newName} onChange={(e) => props.onNameChange(e.target.value)} />
    </div>
    <div>
      number: <input value={props.newNumber} onChange={(e) => props.onNumberChange(e.target.value)} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

export default PersonForm