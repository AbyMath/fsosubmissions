import useAnecdoteStore from '../useAnecdoteStore'
import useNotificationStore from '../useNotificationStore'

const AnecdoteList = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes)
  const filter = useAnecdoteStore((state) => state.filter)
  const voteAnecdote = useAnecdoteStore((state) => state.voteAnecdote)
  const deleteAnecdote = useAnecdoteStore((state) => state.deleteAnecdote)
  const showNotification = useNotificationStore((state) => state.showNotification)

  const handleVote = (anecdote) => {
    voteAnecdote(anecdote.id)
    showNotification(`you voted '${anecdote.content}'`)
  }

  const handleDelete = (anecdote) => {
    deleteAnecdote(anecdote.id)
    showNotification(`deleted '${anecdote.content}'`)
  }

  const filteredAnecdotes = anecdotes.filter((anecdote) =>
    anecdote.content.toLowerCase().includes(filter.toLowerCase())
  )

  const sortedAnecdotes = filteredAnecdotes.toSorted((a, b) => b.votes - a.votes)

  return (
    <div>
      {sortedAnecdotes.map((anecdote) => (
        <div key={anecdote.id} style={{ marginBottom: '15px' }}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes} votes
            <button onClick={() => handleVote(anecdote)} style={{ marginLeft: '10px' }}>
              vote
            </button>
            {anecdote.votes === 0 && (
              <button onClick={() => handleDelete(anecdote)} style={{ marginLeft: '10px', color: 'red' }}>
                delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList