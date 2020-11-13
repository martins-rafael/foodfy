const express = require('express');
const routes = express.Router();
const multer = require('../app/middlewares/multer');

const RecipeController = require('../app/controllers/RecipeController');

const { onlyUsers, isCreator } = require('../app/middlewares/sessions');
const Validator = require('../app/validators/recipe');

// Recipes Admin //
routes.get('/', onlyUsers, RecipeController.index);
routes.get('/my-recipes', onlyUsers, RecipeController.userRecipes);
routes.get('/create', onlyUsers, RecipeController.create);
routes.get('/:id', onlyUsers, RecipeController.show);
routes.get('/:id/edit', onlyUsers, isCreator, RecipeController.edit);
routes.post('/', onlyUsers, multer.array('photos', 5), Validator.post, RecipeController.post);
routes.put('/', onlyUsers, multer.array('photos', 5),Validator.put, RecipeController.put);
routes.delete('/', onlyUsers, RecipeController.delete);

module.exports = routes;