import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Notification from './components/Notification'

const App = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Anecdote App (TanStack Query)</h2>
      <Notification />
      <AnecdoteForm />
      <hr style={{ margin: '20px 0' }} />
      <AnecdoteList />
    </div>
  )
}

export default App