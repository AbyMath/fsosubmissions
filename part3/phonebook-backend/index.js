const dns = require('node:dns/promises')
dns.setServers(['1.1.1.1', '8.8.8.8'])

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const path = require('path')
require('dotenv').config()

const Person = require('./models/person')

const app = express()

app.use(cors())
app.use(express.json())

morgan.token('body', req => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(express.static('dist'))

mongoose.set('strictQuery', false)

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('connected to MongoDB'))
  .catch(err => console.log(err.message))

app.get('/api/persons', (req, res) => {
  Person.find({}).then(res.json.bind(res))
})

app.get('/info', (req, res) => {
  Person.countDocuments({}).then(count => {
    res.send(`<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => person ? res.json(person) : res.status(404).end())
    .catch(next)
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch(next)
})

app.put('/api/persons/:id', (req, res, next) => {
  const person = { name: req.body.name, number: req.body.number }

  Person.findByIdAndUpdate(req.params.id, person, {
    new: true,
    runValidators: true,
    context: 'query'
  })
    .then(res.json.bind(res))
    .catch(next)
})

app.post('/api/persons', (req, res, next) => {
  const person = new Person(req.body)

  person.save()
    .then(res.json.bind(res))
    .catch(next)
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
})

app.use((err, req, res, next) => {
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id' })
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }

  next(err)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})