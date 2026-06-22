import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useUser } from './contexts/UserContext'
import { useNotify, useNotificationValue } from './contexts/NotificationContext'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) {
      return <h2 style={{ padding: 20 }}>Something went wrong. Please reload the page.</h2>
    }
    return this.props.children
  }
}

const Notification = () => {
  const notification = useNotificationValue()
  if (!notification) return null
  const styles = {
    color: notification.isError ? 'red' : 'green',
    background: '#lightgray',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }
  return <div style={styles}>{notification.message}</div>
}

const Navigation = () => {
  const { user, logoutUser } = useUser()
  const navStyle = { padding: 10, background: '#eee', marginBottom: 15 }
  return (
    <nav style={navStyle}>
      <Link to="/" style={{ paddingRight: 10 }}>blogs</Link>
      <Link to="/users" style={{ paddingRight: 10 }}>users</Link>
      {user ? (
        <span>
          <em>{user.name} logged in</em>
          <button onClick={logoutUser} style={{ marginLeft: 10 }}>logout</button>
        </span>
      ) : (
        <Link to="/login">login</Link>
      )}
    </nav>
  )
}

const BlogList = () => {
  const queryClient = useQueryClient()
  const notify = useNotify()
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const { data: blogs, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: () => fetch('/api/blogs').then(res => res.json())
  })

  const createBlogMutation = useMutation({
    mutationFn: (newBlog) => {
      const user = JSON.parse(window.localStorage.getItem('loggedBlogappUser'))
      return fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify(newBlog)
      }).then(res => res.json())
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      notify('a new blog created successfully')
      setTitle('')
      setAuthor('')
      setUrl('')
    }
  })

  const handleCreate = (e) => {
    e.preventDefault()
    createBlogMutation.mutate({ title, author, url })
  }

  if (isLoading) return <div>Loading records...</div>

  return (
    <div>
      <h2>Create New</h2>
      <form onSubmit={handleCreate} style={{ marginBottom: 20 }}>
        <div>title <input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div>author <input value={author} onChange={(e) => setAuthor(e.target.value)} /></div>
        <div>url <input value={url} onChange={(e) => setUrl(e.target.value)} /></div>
        <button type="submit">create</button>
      </form>
      <div className="blog-container">
        {blogs.map(blog => (
          <div key={blog.id} style={{ padding: 10, border: '1px solid #ccc', marginBottom: 5 }}>
            <Link to={`/blogs/${blog.id}`}>{blog.title} - {blog.author}</Link>
          </div>
        ))}
      </div>
    </div>
  )
}

const SingleBlog = () => {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const notify = useNotify()
  const navigate = useNavigate()
  const [comment, setComment] = useState('')

  const { data: blog, isLoading } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => fetch(`/api/blogs/${id}`).then(res => res.json())
  })

  const likeMutation = useMutation({
    mutationFn: (updatedBlog) => {
      return fetch(`/api/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBlog)
      }).then(res => res.json())
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blog', id] })
  })

  const deleteMutation = useMutation({
    mutationFn: () => {
      const user = JSON.parse(window.localStorage.getItem('loggedBlogappUser'))
      return fetch(`/api/blogs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user?.token}` }
      })
    },
    onSuccess: () => {
      notify('blog removed')
      navigate('/')
    }
  })

  const commentMutation = useMutation({
    mutationFn: (text) => {
      return fetch(`/api/blogs/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: text })
      }).then(res => res.json())
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog', id] })
      setComment('')
    }
  })

  if (isLoading || !blog) return <div>Loading...</div>

  return (
    <div>
      <h2>{blog.title} {blog.author}</h2>
      <div><a href={blog.url}>{blog.url}</a></div>
      <div>
        {blog.votes || blog.likes || 0} likes 
        <button onClick={() => likeMutation.mutate({ likes: (blog.likes || 0) + 1 })} style={{ marginLeft: 5 }}>like</button>
      </div>
      <div>added by {blog.user?.name || 'anonymous'}</div>
      <button onClick={() => deleteMutation.mutate()} style={{ marginTop: 10, color: 'red' }}>remove</button>
      
      <h3>Comments</h3>
      <form onSubmit={(e) => { e.preventDefault(); commentMutation.mutate(comment) }}>
        <input value={comment} onChange={(e) => setComment(e.target.value)} />
        <button type="submit">add comment</button>
      </form>
      <ul>
        {blog.comments?.map((c, idx) => <li key={idx}>{c}</li>)}
      </ul>
    </div>
  )
}

const UsersView = () => {
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(res => res.json())
  })

  if (isLoading) return <div>Loading profiles...</div>

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr><th>User Profile</th><th>Blogs Created</th></tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td><Link to={`/users/${u.id}`}>{u.name}</Link></td>
              <td>{u.blogs?.length || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const SingleUser = () => {
  const { id } = useParams()
  const { data: user, isLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: () => fetch(`/api/users/${id}`).then(res => res.json())
  })

  if (isLoading || !user) return <div>Loading user entries...</div>

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>Added blogs</h3>
      <ul>
        {user.blogs?.map(b => <li key={b.id}>{b.title}</li>)}
      </ul>
    </div>
  )
}

const LoginView = () => {
  const { loginUser } = useUser()
  const notify = useNotify()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      loginUser(data)
      navigate('/')
    } catch {
      notify('wrong username or password', true)
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <div>username <input value={username} onChange={(e) => setUsername(e.target.value)} /></div>
      <div>password <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
      <button type="submit">login</button>
    </form>
  )
}

const App = () => {
  const { user } = useUser()

  return (
    <Router>
      <div style={{ padding: 15 }}>
        <h1>Blog Directory App</h1>
        <Navigation />
        <Notification />
        
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={user ? <BlogList /> : <LoginView />} />
            <Route path="/login" element={<LoginView />} />
            <Route path="/blogs/:id" element={<SingleBlog />} />
            <Route path="/users" element={<UsersView />} />
            <Route path="/users/:id" element={<SingleUser />} />
            <Route path="*" element={<h2>Page not found (404)</h2>} />
          </Routes>
        </ErrorBoundary>
      </div>
    </Router>
  )
}

export default App