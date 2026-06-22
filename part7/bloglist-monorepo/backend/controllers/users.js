const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')

const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', {
      title: 1,
      author: 1,
      url: 1,
    })

  response.json(users)
})

usersRouter.get('/:id', async (request, response) => {
  const user = await User
    .findById(request.params.id)
    .populate('blogs', {
      title: 1,
      author: 1,
      url: 1,
    })

  if (!user) {
    return response.status(404).json({
      error: 'user not found',
    })
  }

  response.json(user)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!username || !password) {
    return response.status(400).json({
      error: 'username and password required',
    })
  }

  if (username.length < 3 || password.length < 3) {
    return response.status(400).json({
      error: 'username and password must be at least 3 characters long',
    })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const user = new User({
    username,
    name,
    passwordHash,
  })

try {
  const savedUser = await user.save()
  response.status(201).json(savedUser)
} catch (error) {
  response.status(400).json({
    error: 'username must be unique',
  })
}
})

module.exports = usersRouter