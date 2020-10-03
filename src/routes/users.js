const express = require('express');
const routes = express.Router();

const SessionController = require('../app/controllers/SessionController');
const UserController = require('../app/controllers/UserController');

const UserValidator = require('../app/validators/user');
const SessionValidator = require('../app/validators/session');

// Login/logout //
routes.get('/login', SessionController.loginForm);
routes.post('/login', SessionValidator.login, SessionController.login)
routes.post('/logout', SessionController.logout);

// User register //
routes.get('/register', UserController.registerForm);
routes.post('/register', UserValidator.post, UserController.post);

routes.get('/', UserController.list);
routes.get('/:id/edit', UserValidator.edit, UserController.edit);
routes.put('/', UserValidator.update, UserController.update);
routes.delete('/', UserController.delete);

module.exports = routes;