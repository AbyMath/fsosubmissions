import { useState, useEffect, useRef } from 'react'
import { Routes, Route, Link, Navigate, useNavigate, useMatch } from 'react-router-dom'

import Users from './components/Users'
import User from './components/User'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'

import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState(null)
  const [users, setUsers] = useState([])
  const [comment, setComment] = useState('')

  const navigate = useNavigate()

  const sortBlogs = (list) =>
    [...list].sort((a, b) => b.likes - a.likes)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(data => {
      setBlogs(sortBlogs(data))
    })
  }, [])

  useEffect(() => {
  userService.getAll().then(data => {
    setUsers(data)
  })
  }, [])

  const notify = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password
      })

      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)

      setUsername('')
      setPassword('')

      notify(`Welcome ${user.name}`, 'success')

      navigate('/')
    } catch {
      notify('wrong credentials', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)

    navigate('/')
  }

const handleAddBlog = async (blogObject) => {
  try {
    const returned = await blogService.create(blogObject)

    setBlogs(prev => sortBlogs([...prev, returned]))

    notify(
      `a new blog ${blogObject.title} by ${blogObject.author} added`,
      'success'
    )

    navigate('/')
  } catch (error) {
    notify(
      error.response?.data?.error || 'failed to create blog',
      'error'
    )
  }
}

  const handleLike = async (blog) => {
    if (!user) return

    const updated = {
      ...blog,
      likes: blog.likes + 1,
      user: typeof blog.user === 'object'
        ? blog.user.id
        : blog.user
    }

    const returned = await blogService.update(
      blog.id,
      updated
    )

    setBlogs(prev =>
      sortBlogs(
        prev.map(b =>
          b.id === blog.id
            ? { ...returned, user: blog.user }
            : b
        )
      )
    )
  }

  const handleComment = async (blog) => {
  const returned = await blogService.addComment(
    blog.id,
    comment
  )

  setBlogs(prev =>
    prev.map(b =>
      b.id === blog.id ? returned : b
    )
  )

  setComment('')
}

  const handleDeleteBlog = async (blog) => {
    if (
      window.confirm(
        `Remove blog ${blog.title} by ${blog.author}`
      )
    ) {
      await blogService.remove(blog.id)

      setBlogs(prev =>
        prev.filter(b => b.id !== blog.id)
      )

      navigate('/')
    }
  }

  const match = useMatch('/blogs/:id')
  const selectedBlog = match
  ? blogs.find(blog => blog.id === match.params.id)
  : null
  
  const userMatch = useMatch('/users/:id')
  const selectedUser = userMatch
  ? users.find(user => user.id === userMatch.params.id)
  : null

  return (
    <div>
      <Notification notification={notification} />

      <div style={{ marginBottom: '20px' }}>
  
  <Link to="/">blogs</Link>
  {' | '}
  <Link to="/users">users</Link>

  {user && (
    <>
      {' | '}
      <Link to="/create">create</Link>
    </>
  )}

  {!user && (
    <>
      {' | '}
      <Link to="/login">login</Link>
    </>
  )}

  {user && (
    <>
      {' | '}
      {user.name} logged in
      <button onClick={handleLogout}>
        logout
      </button>
    </>
  )}
</div>

      <Routes>
        <Route
          path="/login"
          element={
            user
              ? <Navigate to="/" />
              : (
                <LoginForm
                  username={username}
                  password={password}
                  setUsername={setUsername}
                  setPassword={setPassword}
                  handleLogin={handleLogin}
                />
              )
          }
        />
<Route
  path="/create"
  element={
    user ? (
      <div>
        <h2>Create Blog</h2>
        <BlogForm onAddBlog={handleAddBlog} />
      </div>
    ) : (
      <Navigate to="/login" />
    )
  }
/>

<Route
  path="/users"
  element={<Users users={users} />}
/>

<Route
  path="/users/:id"
  element={<User user={selectedUser} />}
/>


        <Route
          path="/"
          element={
            <div>
              <h2>Blogs</h2> 

              {blogs.map(blog => (
                <Blog
                key={blog.id}
                blog={blog}
              />
              ))}
            </div>
          }
        />
       <Route
  path="/blogs/:id"
  element={
    selectedBlog ? (
      <div>
        <h2>
          {selectedBlog.title} {selectedBlog.author}
        </h2>

        <a
          href={selectedBlog.url}
          target="_blank"
          rel="noreferrer"
        >
          {selectedBlog.url}
        </a>

        <div>
          likes {selectedBlog.likes}

          {user && (
            <button
              onClick={() => handleLike(selectedBlog)}
            >
              like
            </button>
          )}
        </div>

        <div>
          added by {selectedBlog.user?.name}
          <h3>comments</h3>

<ul>
  {selectedBlog.comments?.map((c, index) => (
    <li key={index}>{c}</li>
  ))}
</ul>

<form
  onSubmit={(event) => {
    event.preventDefault()
    handleComment(selectedBlog)
  }}
>
  <input
    value={comment}
    onChange={({ target }) =>
      setComment(target.value)
    }
  />

  <button type="submit">
    add comment
  </button>
</form>
        </div>

        {user &&
          ((typeof selectedBlog.user === 'object'
            ? selectedBlog.user.username === user.username
            : selectedBlog.user === user.id)) && (
            <button
              onClick={() => handleDeleteBlog(selectedBlog)}
            >
              remove
            </button>
          )}
      </div>
    ) : (
      <div>Blog not found</div>
    )
  }
/>
      </Routes>
    </div>
  )
}

export default App