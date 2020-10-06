const express = require('express');
const routes = express.Router();
const multer = require('../app/middlewares/multer');

const ChefController = require('../app/controllers/ChefController');

const { onlyUsers } = require('../app/middlewares/sessions');

// Chefs Admin //
routes.get('/', onlyUsers, ChefController.index);
routes.get('/create', onlyUsers, ChefController.create);
routes.get('/:id', onlyUsers, ChefController.show);
routes.get('/:id/edit', onlyUsers, ChefController.edit);
routes.post('/', onlyUsers, multer.array('photos', 1), ChefController.post);
routes.put('/', onlyUsers, multer.array('photos', 1), ChefController.put);
routes.delete('/', onlyUsers, ChefController.delete);

module.exports = routes;