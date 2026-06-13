const Blog = require('../models/blog')
const User = require('../models/user')

const getAll = async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', {
      username: 1,
      name: 1,
    })

  response.json(blogs)
}

const getById = async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).json({
      error: 'blog not found',
    })
  }

  response.json(blog)
}

const create = async (request, response) => {
  const user = request.user

  if (!user) {
    return response.status(401).json({
      error: 'token invalid',
    })
  }

  const { title, author, url, likes } = request.body

  if (!title || !url) {
    return response.status(400).json({
      error: 'title and url are required',
    })
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id,
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  const populatedBlog = await Blog.findById(savedBlog._id)
    .populate('user', {
      username: 1,
      name: 1,
    })

  response.status(201).json(populatedBlog)
}

const update = async (request, response) => {
  const { title, author, url, likes, user } = request.body

  const blog = await Blog.findByIdAndUpdate(
    request.params.id,
    {
      title,
      author,
      url,
      likes,
      user,
    },
    {
      returnDocument: 'after',
      runValidators: true,
    }
  ).populate('user', {
    username: 1,
    name: 1,
  })

  if (!blog) {
    return response.status(404).json({
      error: 'blog not found',
    })
  }

  response.json(blog)
}

const remove = async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).json({
      error: 'blog not found',
    })
  }

  const user = request.user

  if (!user) {
    return response.status(401).json({
      error: 'token invalid',
    })
  }

  if (blog.user.toString() !== user.id.toString()) {
    return response.status(403).json({
      error: 'only creator can delete blog',
    })
  }

  await Blog.findByIdAndDelete(request.params.id)

  response.status(204).end()
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
}