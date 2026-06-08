const Persons = (props) => (
  <div>
    {props.persons.map(person => (
      <div key={person.id} style={{ marginBottom: '10px' }}>
        {person.name} {person.number}
        <button style={{ marginLeft: '10px' }} onClick={() => props.onDelete(person.id, person.name)}>
          delete
        </button>
      </div>
    ))}
  </div>
)

export default Persons