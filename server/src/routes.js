const express = require('express');
const routes = express.Router();
const multer = require('multer');
const multerConfig = require('./config/multer');
const UsersController = require('./controllers/UsersController');
const AuthController = require('./controllers/AuthController');
const PostsController = require('./controllers/PostsController');
const CategoriesController = require('./controllers/CategoriesController');
const CommentsController = require('./controllers/CommentsController');
const middlewares = require('./controllers/middlewares');

const usersController = new UsersController();
const authController = new AuthController();
const postsController = new PostsController();
const categoriesController = new CategoriesController();
const commentsController = new CommentsController();

// User routes
routes.get('/users', middlewares, usersController.index);
routes.get('/users/:registry', middlewares, usersController.show);
routes.post('/users', multer(multerConfig).single('file'), usersController.create);
routes.put('/users/:registry', usersController.update);
routes.patch('/users', middlewares, usersController.modify);
routes.delete('/users/:registry', middlewares, usersController.destroy);

// Authentication routes

routes.post('/login', authController.authenticate);
routes.post('/logout', authController.logout);
routes.post('/forgot', authController.forgot);
routes.get('/reset/:token', authController.resetScreen);
routes.post('/reset/:token', authController.resetPassword);

// Post routes
routes.get('/posts', postsController.showAllPosts);
routes.get('/posts/:id', postsController.getPost);
routes.post('/posts', middlewares, postsController.createPost);
routes.put('/posts/:id', middlewares, postsController.updatePost);
routes.delete('/posts/:id', middlewares, postsController.deletePost);

// Category routes
routes.get('/categories', categoriesController.index);
routes.get('/categories/:title', categoriesController.show);
routes.post('/categories', categoriesController.create);

// Comment routes
routes.get('/comments', commentsController.showAllComments);
routes.post('/comments', middlewares, commentsController.createComment);
routes.delete('/comments/:id', middlewares, commentsController.deleteComment);

module.exports = routes;
