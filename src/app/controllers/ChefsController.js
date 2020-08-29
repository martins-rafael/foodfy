const Chef = require('../models/Chef');
const { recipes } = require('../models/Recipe');

module.exports = {
    async index(req, res) {
        try {
            const results = await Chef.all();
            const chefs = results.rows;

            return res.render('admin/chefs/index', { chefs });
        } catch (err) {
            console.error(err);
        }
    },
    create(req, res) {
        return res.render('admin/chefs/create');
    },
    async post(req, res) {
        try {
            const keys = Object.keys(req.body);

            keys.forEach(key => {
                if (req.body[key] == '') res.send('Por favor, preencha todos os campos.');
            });

            const results = await Chef.create(req.body);
            const chefId = results.rows[0].id;

            return res.redirect(`/admin/chefs/${chefId}`);
        } catch (err) {
            console.error(err);
        }
    },
    async show(req, res) {
        try {
            let results = await Chef.find(req.params.id);
            const chef = results.rows[0];

            if (!chef) res.send('Chef não encontrado!');

            results = await Chef.chefRecipes(req.params.id);
            const recipes = results.rows;

            return res.render('admin/chefs/show', { chef, recipes });
        } catch (err) {
            console.error(err);
        }
    },
    async edit(req, res) {
        try {
            const results = await Chef.find(req.params.id);
            const chef = results.rows[0];

            if (!chef) res.send('Chef não encontrado!');

            return res.render('admin/chefs/edit', { chef });
        } catch (err) {
            console.error(err);
        }
    },
    async put(req, res) {
        try {
            const keys = Object.keys(req.body);

            keys.forEach(key => {
                if (req.body[key] == '') res.send('Por favor, preencha todos os campos.');
            });

            await Chef.update(req.body);

            return res.redirect(`/admin/chefs/${req.body.id}`);
        } catch (err) {
            console.error(err);
        }
    },
    async delete(req, res) {
        try {
            await Chef.delete(req.body.id);
            return res.redirect('/admin/chefs');
        } catch (err) {
            console.error(err);
        }
    }
};