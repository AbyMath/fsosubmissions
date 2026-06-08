import { useState, useEffect } from 'react'
import personService from './services/personService'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    personService.getAll().then(data => {
      setPersons(data)
    })
  }, [])

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(person => person.name === newName)

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )
      if (confirmUpdate) {
        const updatedPerson = { ...existingPerson, number: newNumber }
        personService.update(existingPerson.id, updatedPerson)
          .then(data => {
            setPersons(persons.map(p => p.id !== existingPerson.id ? p : data))
            showNotification(`Updated ${newName}'s number`, 'success')
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            showNotification(`Information of ${newName} has already been removed from server`, 'error')
            setPersons(persons.filter(p => p.id !== existingPerson.id))
          })
      }
      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    personService.create(personObject)
      .then(data => {
        setPersons(persons.concat(data))
        showNotification(`Added ${newName}`, 'success')
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        showNotification('Failed to add person', 'error')
      })
  }

  const deletePerson = (id, name) => {
    const confirmDelete = window.confirm(`Delete ${name}?`)
    if (confirmDelete) {
      personService.remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          showNotification(`Deleted ${name}`, 'success')
        })
        .catch(error => {
          showNotification(`Failed to delete ${name}`, 'error')
        })
    }
  }

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification notification={notification} />

      <Filter searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <h3>Add a new</h3>

      <PersonForm
        newName={newName}
        newNumber={newNumber}
        onNameChange={setNewName}
        onNumberChange={setNewNumber}
        onSubmit={addPerson}
      />

      <h3>Numbers</h3>

      <Persons persons={filteredPersons} onDelete={deletePerson} />
    </div>
  )
}

export default App