import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom'
import { useField, useAnecdotes } from './hooks'

const Menu = () => {
  const padding = {
    paddingRight: 5
  }
  return (
    <div>
      <Link to="/" style={padding}>anecdotes</Link>
      <Link to="/create" style={padding}>create new</Link>
      <Link to="/about" style={padding}>about</Link>
    </div>
  )
}

const AnecdoteList = () => {
  const { anecdotes, deleteAnecdote } = useAnecdotes()
  return (
    <div>
      <h2>Anecdotes</h2>
      <ul>
        {anecdotes.map(anecdote => (
          <li key={anecdote.id}>
            <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
            <button onClick={() => deleteAnecdote(anecdote.id)} style={{ marginLeft: 10 }}>
              delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

const Anecdote = () => {
  const { anecdotes } = useAnecdotes()
  const id = useParams().id
  const anecdote = anecdotes.find(a => a.id === Number(id) || a.id === id)

  if (!anecdote) {
    return <div>Anecdote not found</div>
  }

  return (
    <div>
      <h2>{anecdote.content} by {anecdote.author}</h2>
      <div>has {anecdote.votes} votes</div>
      <div>for more info see <a href={anecdote.info}>{anecdote.info}</a></div>
    </div>
  )
}

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>
    <em>An anecdote is a brief, revealing account of an individual person or an incident...</em>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for Full Stack Open.
  </div>
)

const CreateNew = () => {
  const { addAnecdote } = useAnecdotes()
  const navigate = useNavigate()

  const content = useField('text')
  const author = useField('text')
  const info = useField('text')

  const { reset: resetContent, ...contentInput } = content
  const { reset: resetAuthor, ...authorInput } = author
  const { reset: resetInfo, ...infoInput } = info

  const handleSubmit = (e) => {
    e.preventDefault()
    addAnecdote({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    })
    navigate('/')
  }

  const handleReset = (e) => {
    e.preventDefault()
    resetContent()
    resetAuthor()
    resetInfo()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...contentInput} />
        </div>
        <div>
          author
          <input {...authorInput} />
        </div>
        <div>
          url for more info
          <input {...infoInput} />
        </div>
        <button type="submit">create</button>
        <button onClick={handleReset}>reset</button>
      </form>
    </div>
  )
}

const App = () => {
  return (
    <Router>
      <div>
        <h1>Software anecdotes</h1>
        <Menu />
        <Routes>
          <Route path="/" element={<AnecdoteList />} />
          <Route path="/anecdotes/:id" element={<Anecdote />} />
          <Route path="/create" element={<CreateNew />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App