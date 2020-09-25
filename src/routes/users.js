const express = require('express');
const routes = express.Router();

const SessionController = require('../app/controllers/SessionController');
const UserController = require('../app/controllers/UserController');

// Login/logout //
routes.get('/login', SessionController.loginForm);

// User register //
routes.get('/register', UserController.registerForm);
routes.post('/register', UserController.post);

module.exports = routes;