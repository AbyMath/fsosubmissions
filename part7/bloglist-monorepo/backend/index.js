const dns = require('node:dns/promises')
dns.setServers(['1.1.1.1', '8.8.8.8'])

const path = require('path')
const express = require('express')
const mongoose = require('mongoose')

const config = require('./utils/config')
const logger = require('./utils/logger')

const blogsRouter = require('./routes/blogs')
const usersRouter = require('./routes/users')
const loginRouter = require('./routes/login')
const middleware = require('./utils/middleware')
const testingRouter = require('./controllers/testing')

const app = express()

mongoose.connect(config.MONGODB_URI)
  .then(() => logger.info('connected to MongoDB'))
  .catch(error => logger.error('error connecting to MongoDB:', error.message))

app.use(express.static(path.join(__dirname, 'dist')))
app.use(express.json())
app.use(middleware.tokenExtractor)
app.use(middleware.userExtractor)

app.use('/api/testing', testingRouter)

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)

app.get('/{*splat}', (request, response) => {
  response.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
})

const PORT = config.PORT
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`))

module.exports = app