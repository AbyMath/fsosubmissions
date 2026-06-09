# Phonebook Backend

Phonebook application backend built with Node.js and Express.

## Backend API

Available at: `https://your-deployment-url.com`

### Endpoints

- `GET /api/persons` - Get all persons
- `GET /api/persons/:id` - Get single person
- `POST /api/persons` - Add new person
- `DELETE /api/persons/:id` - Delete person
- `GET /info` - Get phonebook info

## Deployed Application

Frontend is served from the backend at: `https://your-deployment-url.com`

## Local Development

```bash
npm install
npm run dev
```

Server runs on port 3001.

## Production Build

Build includes frontend static files from `dist/` folder.