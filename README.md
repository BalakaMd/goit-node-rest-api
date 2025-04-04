# Contacts REST API

A Node.js REST API for managing contacts with full CRUD functionality.

## Features

- List all contacts
- Get contact by ID
- Create new contacts
- Update existing contacts
- Delete contacts
- Partial updates of specific fields

## Technologies

- Node.js
- Express.js
- Joi (for validation)

## API Endpoints

| Method | Endpoint          | Description             |
| ------ | ----------------- | ----------------------- |
| GET    | /api/contacts     | Get all contacts        |
| GET    | /api/contacts/:id | Get contact by ID       |
| POST   | /api/contacts     | Create new contact      |
| PUT    | /api/contacts/:id | Update existing contact |
| DELETE | /api/contacts/:id | Delete contact          |

## Data Structure

Contacts have the following fields:

- name (required)
- email (required)
- phone (required)

## Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd goit-node-rest-api

# Install dependencies
npm install

# Start the server
npm start

# Start the server in development mode
npm run dev
```
