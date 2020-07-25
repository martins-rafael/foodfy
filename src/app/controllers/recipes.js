const Recipe = require('../models/Recipe');

module.exports = {
    index(req, res) {
        Recipe.all(function (recipes) {
            return res.render('admin/recipes/index', { recipes });
        });
    },
    create(req, res) {
        Recipe.chefsSelectOptions(function (chefsOptions) {
            return res.render('admin/recipes/create', { chefsOptions });
        });
    },
    post(req, res) {
        const keys = Object.keys(req.body);

        for (let key of keys) {
            if (req.body[key] == '') res.send('Por favor, preencha todos os campos.');
        }

        Recipe.create(req.body, function (recipe) {
            return res.redirect(`/admin/recipes/${recipe.id}`);
        });
    },
    show(req, res) {
        Recipe.find(req.params.id, function (recipe) {
            if (!recipe) res.send('Receita não encontrada!');

            return res.render('admin/recipes/show', { recipe });
        });
    },
    edit(req, res) {
        Recipe.find(req.params.id, function (recipe) {
            Recipe.chefsSelectOptions(function (chefsOptions) {
                if (!recipe) res.send('Receita não encontrada!');

                return res.render('admin/recipes/edit', { recipe, chefsOptions });
            });
        });
    },
    put(req, res) {
        const recipeIndex = req.params.index;
        const keys = Object.keys(req.body);

        for (let key of keys) {
            if (req.body[key] == '') res.send('Por favor, preencha todos os campos.');
        }
        Recipe.update(req.body, function () {
            res.redirect(`/admin/recipes/${req.body.id}`);
        });
    },
    delete(req, res) {
        Recipe.delete(req.body.id, function () {
            return res.redirect('/admin');
        });
    }
};