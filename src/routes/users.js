const express = require('express');
const routes = express.Router();

const SessionController = require('../app/controllers/SessionController');
const ProfileController = require('../app/controllers/ProfileController');
const UserController = require('../app/controllers/UserController');

const UserValidator = require('../app/validators/user');
const SessionValidator = require('../app/validators/session');

// Login/logout //
routes.get('/login', SessionController.loginForm);
routes.post('/login', SessionValidator.login, SessionController.login)
routes.post('/logout', SessionController.logout);

// Profile //
routes.get('/profile', UserValidator.show, ProfileController.index);

// Reset Password //
routes.get('/forgot-password', SessionController.forgotForm);
routes.get('/password-reset', SessionController.resetForm);

// User register //
routes.get('/register', UserController.registerForm);
routes.post('/register', UserValidator.post, UserController.post);

routes.get('/', UserController.list);
routes.get('/:id/edit', UserValidator.edit, UserController.edit);
routes.put('/', UserValidator.update, UserController.update);
routes.delete('/', UserController.delete);

module.exports = routes;