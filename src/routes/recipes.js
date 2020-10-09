const express = require('express');
const routes = express.Router();
const multer = require('../app/middlewares/multer');

const RecipeController = require('../app/controllers/RecipeController');

const { onlyUsers, isCreator } = require('../app/middlewares/sessions');

// Recipes Admin //
routes.get('/', onlyUsers, RecipeController.index);
routes.get('/my-recipes', onlyUsers, RecipeController.recipes);
routes.get('/create', onlyUsers, RecipeController.create);
routes.get('/:id', onlyUsers, RecipeController.show);
routes.get('/:id/edit', onlyUsers, isCreator, RecipeController.edit);
routes.post('/', onlyUsers, multer.array('photos', 5), RecipeController.post);
routes.put('/', onlyUsers, multer.array('photos', 5), RecipeController.put);
routes.delete('/', onlyUsers, RecipeController.delete);

module.exports = routes;