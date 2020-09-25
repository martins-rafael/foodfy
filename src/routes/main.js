const express = require('express');
const routes = express.Router();

const HomeController = require('../app/controllers/HomeController');

// Main site //
routes.get('/', HomeController.index);
routes.get('/about', HomeController.about);
routes.get('/recipes', HomeController.recipes);
routes.get('/recipes/:id', HomeController.showRecipe);
routes.get('/chefs', HomeController.chefs);
routes.get('/chefs/:id', HomeController.showChef);

module.exports = routes;