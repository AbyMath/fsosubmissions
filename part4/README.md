# Blog List API (Full Stack Open Part 4)

Backend for a blog list application built with Node.js, Express, and MongoDB.

## What it does

- CRUD for blogs (create, read, update likes, delete)
- Users with username, name, and hashed password
- JWT login authentication
- Only blog creator can delete their blog
- Blogs linked to users
- Basic validation (username/password length, required fields)
- Default likes = 0
- Custom id field instead of MongoDB _id

## Testing

- Unit tests for helper functions
- API tests with Supertest
- Tests for blogs, users, and authentication
- Test database used

## Main endpoints

- `GET /api/blogs`
- `POST /api/blogs` (token required)
- `PUT /api/blogs/:id`
- `DELETE /api/blogs/:id` (owner only)
- `GET /api/users`
- `POST /api/users`
- `POST /api/login`

## Stack

Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, Jest

## Status

Completed Full Stack Open Part 4 (Exercises 4.1–4.23)