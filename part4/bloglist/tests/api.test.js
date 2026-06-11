const { test, describe, before, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../index')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
]

describe('Blog API', () => {
  let token
  let userId

  before(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})

    const userRes = await api
      .post('/api/users')
      .send({
        username: 'testuser',
        name: 'Test User',
        password: 'password123'
      })

    userId = userRes.body.id

    const loginRes = await api
      .post('/api/login')
      .send({
        username: 'testuser',
        password: 'password123'
      })

    token = loginRes.body.token

    for (const blog of initialBlogs) {
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blog)
    }
  })

  after(async () => {
    await mongoose.connection.close()
  })

  describe('GET /api/blogs', () => {
    test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
      const response = await api.get('/api/blogs')
      assert.strictEqual(response.body.length, initialBlogs.length)
    })

    test('a specific blog is within the returned blogs', async () => {
      const response = await api.get('/api/blogs')
      const titles = response.body.map(blog => blog.title)
      assert(titles.includes('React patterns'))
    })

    test('blog id is named id not _id', async () => {
      const response = await api.get('/api/blogs')
      const blog = response.body[0]
      assert(blog.id)
      assert.strictEqual(blog._id, undefined)
    })
  })

  describe('POST /api/blogs', () => {
    test('a valid blog can be added', async () => {
      const newBlog = {
        title: 'Async patterns in Node.js',
        author: 'Node Master',
        url: 'https://nodepatternscom/',
        likes: 3,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const response = await api.get('/api/blogs')
      const titles = response.body.map(blog => blog.title)
      assert.strictEqual(response.body.length, initialBlogs.length + 1)
      assert(titles.includes('Async patterns in Node.js'))
    })

    test('blog without title returns 400', async () => {
      const newBlog = {
        author: 'Test Author',
        url: 'https://test.com/',
        likes: 0,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
    })

    test('blog without url returns 400', async () => {
      const newBlog = {
        title: 'Test Blog',
        author: 'Test Author',
        likes: 0,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
    })

    test('blog without likes defaults to 0', async () => {
      const newBlog = {
        title: 'Blog without likes',
        author: 'Anonymous',
        url: 'https://nolikeshere.com/',
      }

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)

      assert.strictEqual(response.body.likes, 0)
    })

    test('adding blog fails with 401 if no token provided', async () => {
      const newBlog = {
        title: 'Unauthorized Blog',
        author: 'Hacker',
        url: 'https://hack.com/',
        likes: 0,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
    })
  })

  describe('DELETE /api/blogs/:id', () => {
    test('a blog can be deleted', async () => {
      const blogsAtStart = await api.get('/api/blogs')
      const blogToDelete = blogsAtStart.body[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await api.get('/api/blogs')
      assert.strictEqual(blogsAtEnd.body.length, blogsAtStart.body.length - 1)

      const titles = blogsAtEnd.body.map(blog => blog.title)
      assert(!titles.includes(blogToDelete.title))
    })
  })

  describe('PUT /api/blogs/:id', () => {
    test('a blog can be updated', async () => {
      const blogsAtStart = await api.get('/api/blogs')
      const blogToUpdate = blogsAtStart.body[0]

      const updatedBlog = {
        title: blogToUpdate.title,
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: 99,
      }

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)

      assert.strictEqual(response.body.likes, 99)

      const blogsAtEnd = await api.get('/api/blogs')
      const updatedInDb = blogsAtEnd.body.find(blog => blog.id === blogToUpdate.id)
      assert.strictEqual(updatedInDb.likes, 99)
    })
  })
})