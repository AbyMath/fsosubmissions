import { useEffect } from 'react'
import useAnecdoteStore from './useAnecdoteStore'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Filter from './components/Filter'
import Notification from './components/Notification'

const App = () => {
  const fetchAnecdotes = useAnecdoteStore((state) => state.fetchAnecdotes)

  useEffect(() => {
    fetchAnecdotes()
  }, [fetchAnecdotes])

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <Filter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App