const Recipe = require('../models/Recipe');

module.exports = {
    async index(req, res) {
        try {
            const results = await Recipe.all();
            const recipes = results.rows;

            return res.render('admin/recipes/index', { recipes });
        } catch (err) {
            console.error(err);
        }
    },
    async create(req, res) {
        try {
            const results = await Recipe.chefsSelectOptions();
            const chefsOptions = results.rows;

            return res.render('admin/recipes/create', { chefsOptions });
        } catch (err) {
            console.error(err);
        }
    },
    async post(req, res) {
        try {
            const keys = Object.keys(req.body);

            keys.forEach(key => {
                if (req.body[key] == '') res.send('Por favor, preencha todos os campos.');
            });

            const results = await Recipe.create(req.body);
            const recipeId = results.rows[0].id;

            return res.redirect(`/admin/recipes/${recipeId}`);
        } catch (err) {
            console.error(err);
        }
    },
    async show(req, res) {
        try {
            const results = await Recipe.find(req.params.id);
            const recipe = results.rows[0];

            if (!recipe) res.send('Receita não encontrada!');

            return res.render('admin/recipes/show', { recipe });
        } catch (err) {
            console.error(err);
        }
    },
    async edit(req, res) {
        try {
            let results = await Recipe.find(req.params.id);
            const recipe = results.rows[0];

            if (!recipe) res.send('Receita não encontrada!');

            results = await Recipe.chefsSelectOptions();
            const chefsOptions = results.rows;

            return res.render('admin/recipes/edit', { recipe, chefsOptions });
        } catch (err) {
            console.log(err);
        }
    },
    async put(req, res) {
        try {
            const keys = Object.keys(req.body);

            keys.forEach(key => {
                if (req.body[key] == '') res.send('Por favor, preencha todos os campos.');
            });

            await Recipe.update(req.body);

            return res.redirect(`/admin/recipes/${req.body.id}`);
        } catch (err) {
            console.error(err);
        }
    },
    async delete(req, res) {
        try {
            await Recipe.delete(req.body.id);
            return res.redirect('/admin');
        } catch (err) {
            console.error(err);
        }
    }
};