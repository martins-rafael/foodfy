const express = require('express');
const routes = express.Router();
const multer = require('./app/middlewares/multer');
const main = require('./app/controllers/HomeController');
const recipes = require('./app/controllers/RecipesController');
const chefs = require('./app/controllers/ChefsController');

// Main //
routes.get('/', main.index);
routes.get('/about', main.about);
routes.get('/recipes', main.recipes);
routes.get('/recipes/:id', main.showRecipe);
routes.get('/chefs', main.chefs);
routes.get('/chefs/:id', main.showChef);

// Admin //
routes.get('/admin', function (req, res) {
    return res.redirect('/admin/recipes');
});

// Recipes Admin //
routes.get('/admin/recipes', recipes.index);
routes.get('/admin/recipes/create', recipes.create);
routes.get('/admin/recipes/:id', recipes.show);
routes.get('/admin/recipes/:id/edit', recipes.edit);
routes.post('/admin/recipes', multer.array('photos', 5), recipes.post);
routes.put('/admin/recipes', multer.array('photos', 5), recipes.put);
routes.delete('/admin/recipes', recipes.delete);

// Chefs Admin //
routes.get('/admin/chefs', chefs.index);
routes.get('/admin/chefs/create', chefs.create);
routes.get('/admin/chefs/:id', chefs.show);
routes.get('/admin/chefs/:id/edit', chefs.edit);
routes.post('/admin/chefs', multer.array('photos', 1), chefs.post);
routes.put('/admin/chefs', multer.array('photos', 1), chefs.put);
routes.delete('/admin/chefs', chefs.delete);

module.exports = routes;