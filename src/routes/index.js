const express = require('express');
const routes = express.Router();

const { onlyUsers } = require('../app/middlewares/sessions');

const main = require('./main');
const recipes = require('./recipes');
const chefs = require('./chefs');
const users = require('./users');

routes.use(main);
routes.use('/admin/recipes', recipes);
routes.use('/admin/chefs', chefs);
routes.use('/admin/users', users);

// Alias //
routes.get('/login', (req, res) => res.redirect('/admin/users/login'));
routes.get('/admin', onlyUsers, (req, res) => res.redirect('/admin/recipes'));

module.exports = routes;