const loadRecipeService = require('../services/LoadRecipeService');
const loadChefService = require('../services/LoadChefService');

module.exports = {
    async index(req, res) {
        try {
            const recipes = await loadRecipeService.load('recipes');
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

            const recipes = await loadRecipeService.load('recipes', params);
            const pagination = { page };

            recipes.length == 0
            ? pagination.total = 1
            : pagination.total = Math.ceil(recipes[0].total / limit);

            if (search) return res.render('main/search-result', { 
                recipes, search, pagination 
            });

            return res.render('main/recipes', { recipes, pagination });
        } catch (err) {
            console.error(err);
        }
    },
    async showRecipe(req, res) {
        try {
            const recipe = await loadRecipeService.load('recipe', req.params.id);
            if (!recipe) return res.send('Receita não encontrada!');
            return res.render('main/recipe-page', { recipe });
        } catch (err) {
            console.error(err);
        }
    },
    async chefs(req, res) {
        try {
            const chefs = await loadChefService.load('chefs')
            return res.render('main/chefs', { chefs });
        } catch (err) {
            console.error(err);
        }
    },
    async showChef(req, res) {
        try {
            const chef = await loadChefService.load('chef', req.params.id);
            if (!chef) res.send('Chef não encontrado!');
            return res.render('main/chef-profile', { chef });
        } catch (err) {
            console.error(err);
        }
    }
};