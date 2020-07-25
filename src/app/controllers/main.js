const Recipe = require('../models/Recipe');
const Chef = require('../models/Chef');

module.exports = {
    index(req, res) {
        const { search } = req.query;

        if (search) {
            Recipe.findBy(search, function (recipes) {
                return res.render('main/result', { search, recipes });
            });
        } else {
            Recipe.all(function (recipes) {
                return res.render('main/index', { recipes });
            });
        }
    },
    about(req, res) {
        return res.render('main/about');
    },
    recipes(req, res) {
        Recipe.all(function (recipes) {
            return res.render('main/recipes', { recipes });
        });
    },
    showRecipe(req, res) {
        Recipe.find(req.params.id, function (recipe) {
            if (!recipe) return res.send('Receita não encontrada!');

            return res.render('main/recipe', { recipe });
        });
    },
    chefs(req, res) {
        Chef.all(function (chefs) {
            return res.render('main/chefs', { chefs });
        });
    },
    showChef(req, res) {
        Chef.find(req.params.id, function (chef) {
            Chef.chefRecipes(req.params.id, function (recipes) {
                if (!chef) res.send('Chef não encontrado!');

                return res.render('main/chef', { chef, recipes });
            });
        });
    }
};