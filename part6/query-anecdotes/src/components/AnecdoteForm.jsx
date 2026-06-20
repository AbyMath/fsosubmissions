import { useAnecdoteQuery } from '../hooks/useAnecdoteQuery'

const AnecdoteForm = () => {
  const { createAnecdote } = useAnecdoteQuery()

  const addAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    if (content.trim()) {
      createAnecdote(content)
    }
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={addAnecdote}>
        <input name="anecdote" />
        <button type="submit" style={{ marginLeft: '5px' }}>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm