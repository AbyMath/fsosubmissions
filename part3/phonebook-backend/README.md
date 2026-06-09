# Phonebook Backend

Backend for Phonebook application built with Node.js, Express, and MongoDB.

## Live Application

https://phonebook-vzoz.onrender.com

## API Endpoints

- GET /api/persons - Get all persons
- GET /api/persons/:id - Get single person
- POST /api/persons - Add new person
- PUT /api/persons/:id - Update person
- DELETE /api/persons/:id - Delete person
- GET /info - Get phonebook info

## Frontend

Frontend is built separately and served from this backend using the `dist/` folder.

## Tech Stack

- Node.js
- Express
- MongoDB (Atlas)
- Mongoose

## Local Development

```bash
npm install
npm run dev
```

Server runs on port 3001 locally.

## Production Notes

- Uses `process.env.PORT` on Render
- Frontend is served from `dist/` folder
- MongoDB Atlas is used for database