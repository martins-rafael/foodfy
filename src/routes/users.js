const express = require('express');
const routes = express.Router();

const SessionController = require('../app/controllers/SessionController');
const UserController = require('../app/controllers/UserController');

const UserValidator = require('../app/validators/user');

// Login/logout //
routes.get('/login', SessionController.loginForm);

// User register //
routes.get('/register', UserController.registerForm);
routes.post('/register', UserValidator.post, UserController.post);

module.exports = routes;