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
routes.post('/', UserValidator.post, UserController.post);

routes.get('/:id/edit', UserValidator.edit, UserController.edit);

module.exports = routes;