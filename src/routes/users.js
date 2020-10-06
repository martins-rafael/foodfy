const express = require('express');
const routes = express.Router();

const SessionController = require('../app/controllers/SessionController');
const ProfileController = require('../app/controllers/ProfileController');
const UserController = require('../app/controllers/UserController');

const UserValidator = require('../app/validators/user');
const SessionValidator = require('../app/validators/session');

const { onlyUsers } = require('../app/middlewares/sessions');

// Login/logout //
routes.get('/login', SessionController.loginForm);
routes.post('/login', SessionValidator.login, SessionController.login)
routes.post('/logout', SessionController.logout);

// Profile //
routes.get('/profile', onlyUsers, UserValidator.show, ProfileController.index);

// Reset Password //
routes.get('/forgot-password', SessionController.forgotForm);
routes.get('/password-reset', SessionController.resetForm);

// User register //
routes.get('/register', onlyUsers, UserController.registerForm);
routes.post('/register', onlyUsers, UserValidator.post, UserController.post);

routes.get('/', onlyUsers, UserController.list);
routes.get('/:id/edit', onlyUsers, UserValidator.edit, UserController.edit);
routes.put('/', onlyUsers, UserValidator.update, UserController.update);
routes.delete('/', onlyUsers, UserController.delete);

module.exports = routes;