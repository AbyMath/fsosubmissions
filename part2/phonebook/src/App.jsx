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
    personService.getAll().then(setPersons)
  }, [])

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }

  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(p => p.name === newName)

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )

      if (confirmUpdate) {
        personService.update(existingPerson.id, {
          ...existingPerson,
          number: newNumber
        })
          .then(updated => {
            setPersons(prev =>
              prev.map(p => p.id === existingPerson.id ? updated : p)
            )
            showNotification(`Updated ${newName}`, 'success')
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            const data = error.response?.data

            const message =
              (typeof data === 'string'
                ? data
                : data?.error) ||
              error.message ||
              'Update failed'

            showNotification(message, 'error')
          })
      }
      return
    }

    personService.create({
      name: newName,
      number: newNumber
    })
      .then(created => {
        setPersons(prev => prev.concat(created))
        showNotification(`Added ${newName}`, 'success')
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        const data = error.response?.data

        const message =
          (typeof data === 'string'
            ? data
            : data?.error) ||
          error.message ||
          'Failed to add person'

        showNotification(message, 'error')
      })
  }

  const deletePerson = (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) return

    personService.remove(id)
      .then(() => {
        setPersons(prev => prev.filter(p => p.id !== id))
        showNotification(`Deleted ${name}`, 'success')
      })
      .catch(error => {
        const data = error.response?.data

        const message =
          (typeof data === 'string'
            ? data
            : data?.error) ||
          error.message ||
          'Delete failed'

        showNotification(message, 'error')
      })
  }

  const filteredPersons = persons.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
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