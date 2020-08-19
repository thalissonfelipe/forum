const express = require('express');
const routes = express.Router();
const UsersController = require('./controllers/UsersController');
const AuthController = require('./controllers/AuthController');
const PostsController = require('./controllers/PostsController');
const middlewares = require('./controllers/middlewares');

const usersController = new UsersController();
const authController = new AuthController();
const postsController = new PostsController();

// User routes
routes.get('/users', middlewares, usersController.index);
routes.get('/users/:registry', middlewares, usersController.show);
routes.post('/users', middlewares, authController.create);
routes.post('/users/login', authController.authenticate);
routes.post('/users/logout', authController.logout);
routes.put('/users/:registry', usersController.update);
routes.delete('/users/:registry', middlewares, usersController.destroy);

//Post routes

routes.route('/posts')
    .get(postsController.showAllPosts)
    .post(postsController.createPost);
routes.route('/posts/:id')
    .get(postsController.getPost)
    .patch(postsController.updatePost)
    .delete(postsController.deletePost);

module.exports = routes;

