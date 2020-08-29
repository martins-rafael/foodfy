const Recipe = require('../models/Recipe');
const Chef = require('../models/Chef');

module.exports = {
    async index(req, res) {
        try {
            const results = await Recipe.all();
            const recipes = results.rows;
            recipes.splice(6, recipes.length);

            return res.render('main/index', { recipes });
        } catch (err) {
            console.error(err);
        }
    },
    about(req, res) {
        return res.render('main/about');
    },
    async recipes(req, res) {
        try {
            let { search, page, limit } = req.query;
            page = page || 1;
            limit = limit || 6;
            let offset = limit * (page - 1);

            const params = {
                search,
                limit,
                offset,
            };

            const results = await Recipe.recipes(params);
            const recipes = results.rows;

            const pagination = {};

            if (recipes.length == 0) {
                pagination.total = 1;
                pagination.page = page;
            } else {
                pagination.total = Math.ceil(recipes[0].total / limit);;
                pagination.page = page;
            }

            if (search) return res.render('main/result', { recipes, search, pagination });

            return res.render('main/recipes', { recipes, pagination });
        } catch (err) {
            console.error(err);
        }
    },
    async showRecipe(req, res) {
        try {
            const results = await Recipe.find(req.params.id);
            const recipe = results.rows[0];

            if (!recipe) return res.send('Receita não encontrada!');

            return res.render('main/recipe', { recipe });
        } catch (err) {
            console.error(err);
        }
    },
    async chefs(req, res) {
        try {
            const results = await Chef.all();
            const chefs = results.rows;

            return res.render('main/chefs', { chefs });
        } catch (err) {
            console.error(err);
        }
    },
    async showChef(req, res) {
        try {
            let results = await Chef.find(req.params.id);
            const chef = results.rows[0];

            if (!chef) res.send('Chef não encontrado!');

            results = await Chef.chefRecipes(req.params.id);
            const recipes = results.rows;

            return res.render('main/chef', { chef, recipes });
        } catch (err) {
            console.error(err);
        }
    }
};