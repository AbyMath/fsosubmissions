import { useAnecdoteQuery } from '../hooks/useAnecdoteQuery'

const AnecdoteList = () => {
  const { anecdotes, isLoading, isError, voteAnecdote } = useAnecdoteQuery()

  if (isLoading) {
    return <div>loading data...</div>
  }

  if (isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const sortedAnecdotes = anecdotes.toSorted((a, b) => b.votes - a.votes)

  return (
    <div>
      {sortedAnecdotes.map((anecdote) => (
        <div key={anecdote.id} style={{ marginBottom: '15px' }}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes} votes
            <button onClick={() => voteAnecdote(anecdote)} style={{ marginLeft: '10px' }}>
              vote
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList