const express = require('express');
const routes = express.Router();
const recipes = require('./recipes');
const chefs = require('./chefs');
const users = require('./users');
const HomeController = require('../app/controllers/HomeController');

routes.use('/admin/recipes', recipes);
routes.use('/admin/chefs', chefs);
routes.use('/admin/users', users);

// Home //
routes.get('/', HomeController.index);
routes.get('/about', HomeController.about);
routes.get('/recipes', HomeController.recipes);
routes.get('/recipes/:id', HomeController.showRecipe);
routes.get('/chefs', HomeController.chefs);
routes.get('/chefs/:id', HomeController.showChef);

// Alias //

routes.get('/login', (req, res) => res.redirect('/admin/users/login'));
routes.get('/admin', (req, res) => res.redirect('/admin/recipes'));

module.exports = routes;