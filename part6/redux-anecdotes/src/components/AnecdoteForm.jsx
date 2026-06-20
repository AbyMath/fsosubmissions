import useAnecdoteStore from '../useAnecdoteStore'
import useNotificationStore from '../useNotificationStore'

const AnecdoteForm = () => {
  const createAnecdote = useAnecdoteStore((state) => state.createAnecdote)
  const showNotification = useNotificationStore((state) => state.showNotification)

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    if (content.trim()) {
      await createAnecdote(content)
      showNotification(`new anecdote '${content}' created`)
    }
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit" style={{ marginTop: '5px' }}>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm