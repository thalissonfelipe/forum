const express = require('express');
const routes = express.Router();
const UsersController = require('./controllers/UsersController');

const usersController = new UsersController();

// User routes
routes.get('/users', usersController.index);
routes.get('/users/:registry', usersController.show);
routes.post('/users', usersController.create);
routes.put('/users/:registry', usersController.update);
routes.delete('/users/:registry', usersController.destroy);

module.exports = routes;
