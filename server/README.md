# Uniquorum Server

## Install dependencies

`npm install`

## Run server

`npm start` or `npm run dev`

## Run eslint

`npm run lint`

## Endpoints

### User's endpoints

- GET /users
- GET /users/:registry
- POST /users
- POST /users/login
- POST /users/logout
- PUT /users/:registry
- DELETE /users/:registry

### Post's endpoints

- GET /posts
- GET /posts/:id
- POST /posts
- PUT /posts/:id
- DELETE /posts/:id

### Category's endpoints

- GET /categories
- GET /categories/:title
- POST /categories

### Comment's endpoints

- GET /comments
- POST /comments
- DELETE /comments/:id