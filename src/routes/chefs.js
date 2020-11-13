const express = require('express');
const routes = express.Router();
const multer = require('../app/middlewares/multer');

const ChefController = require('../app/controllers/ChefController');

const { onlyUsers, isAdmin } = require('../app/middlewares/sessions');
const Validator = require('../app/validators/chef');

// Chefs Admin //
routes.get('/', onlyUsers, ChefController.index);
routes.get('/create', onlyUsers, isAdmin, ChefController.create);
routes.get('/:id', onlyUsers, ChefController.show);
routes.get('/:id/edit', isAdmin, onlyUsers, ChefController.edit);
routes.post('/', onlyUsers, isAdmin, multer.array('photos', 1), Validator.post, ChefController.post);
routes.put('/', onlyUsers, isAdmin, multer.array('photos', 1), Validator.put, ChefController.put);
routes.delete('/', onlyUsers, isAdmin, ChefController.delete);

module.exports = routes;