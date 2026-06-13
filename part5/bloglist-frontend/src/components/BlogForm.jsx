import { useState } from 'react'

const BlogForm = ({ onAddBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!title.trim() || !url.trim()) {
  return
}
    onAddBlog({
      title,
      author,
      url,
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h3>create new blog</h3>
      <form onSubmit={handleSubmit}>
        <div>
          title
          <input
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            style={{ marginLeft: '10px' }}
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          author
          <input
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            style={{ marginLeft: '10px' }}
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          url
          <input
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            style={{ marginLeft: '10px' }}
          />
        </div>
        <button type="submit" style={{ marginTop: '10px' }}>create</button>
      </form>
    </div>
  )
}

export default BlogForm