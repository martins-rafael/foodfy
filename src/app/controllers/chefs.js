const Chef = require('../models/Chef');

module.exports = {
    index(req, res) {
        Chef.all(function (chefs) {
            return res.render('admin/chefs/index', { chefs });
        });
    },
    create(req, res) {
        return res.render('admin/chefs/create');
    },
    post(req, res) {
        const keys = Object.keys(req.body);

        for (let key of keys) {
            if (req.body[key] == '') res.send('Por favor, preencha todos os campos.');
        }

        Chef.create(req.body, function (chef) {
            return res.redirect(`/admin/chefs/${chef.id}`);
        });
    },
    show(req, res) {
        Chef.find(req.params.id, function (chef) {
            Chef.chefRecipes(req.params.id, function (recipes) {
                if (!chef) res.send('Chef não encontrado!');

                return res.render('admin/chefs/show', { chef, recipes });
            });
        });
    },
    edit(req, res) {
        Chef.find(req.params.id, function (chef) {
            if (!chef) res.send('Chef não encontrado!');

            return res.render('admin/chefs/edit', { chef });
        });
    },
    put(req, res) {
        const keys = Object.keys(req.body);

        for (let key of keys) {
            if (req.body[key] == '') res.send('Por favor, preencha todos os campos.');
        }

        Chef.update(req.body, function () {
            return res.redirect(`/admin/chefs/${req.body.id}`);
        });
    },
    delete(req, res) {
        Chef.delete(req.body.id, function () {
            res.redirect('/admin/chefs');
        });
    }
};