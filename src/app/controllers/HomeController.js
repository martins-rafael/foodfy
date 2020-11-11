const Recipe = require('../models/Recipe');
const Chef = require('../models/Chef');
const File = require('../models/File');

module.exports = {
    async index(req, res) {
        try {
            const recipes = await Recipe.all();
            recipes.splice(6, recipes.length);

            async function getImage(recipeId) {
                const file = await Recipe.files(recipeId);
                return `${req.protocol}://${req.headers.host}${file[0].path.replace('public', '')}`;
            }

            const recipesPromise = recipes.map(async recipe => {
                recipe.image = await getImage(recipe.id);
                return recipe;
            });

            const allRecipes = await Promise.all(recipesPromise);

            return res.render('main/index', { recipes: allRecipes });
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

            const recipes = await Recipe.recipes(params);

            async function getImage(recipeId) {
                const file = await Recipe.files(recipeId);
                return `${req.protocol}://${req.headers.host}${file[0].path.replace('public', '')}`;
            }

            const recipesPromise = recipes.map(async recipe => {
                recipe.image = await getImage(recipe.id);
                return recipe;
            });

            const allRecipes = await Promise.all(recipesPromise);

            const pagination = { page };

            if (recipes.length == 0) {
                pagination.total = 1;
            } else {
                pagination.total = Math.ceil(recipes[0].total / limit);
            }

            if (search) return res.render('main/search-result', { 
                recipes: allRecipes, search, pagination 
            });

            return res.render('main/recipes', { recipes: allRecipes, pagination });
        } catch (err) {
            console.error(err);
        }
    },
    async showRecipe(req, res) {
        try {
            const recipe = await Recipe.find(req.params.id);

            if (!recipe) return res.send('Receita não encontrada!');

            let files = await Recipe.files(recipe.id);
            files = files.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
            }));

            return res.render('main/recipe-page', { recipe, files });
        } catch (err) {
            console.error(err);
        }
    },
    async chefs(req, res) {
        try {
            const chefs = await Chef.all();

            async function getImage(file_id) {
                const file = await File.findOne({ where: { id: file_id } } );
                return `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`;
            }

            const chefsPromise = chefs.map(async chef => {
                chef.image = await getImage(chef.file_id);
                return chef;
            });

            const allChefs = await Promise.all(chefsPromise);

            return res.render('main/chefs', { chefs: allChefs });
        } catch (err) {
            console.error(err);
        }
    },
    async showChef(req, res) {
        try {
            const chef = await Chef.find(req.params.id);

            if (!chef) res.send('Chef não encontrado!');

            const file = await File.findOne({ where: { id: chef.file_id } });
            chef.file = file;
            chef.file.src = `${req.protocol}://${req.headers.host}${chef.file.path.replace('public', '')}`;

            const recipes = await Chef.chefRecipes(req.params.id);

            async function getImage(recipeId) {
                const files = await Recipe.files(recipeId);
                return `${req.protocol}://${req.headers.host}${files[0].path.replace('public', '')}`;
            }

            const recipesPromise = recipes.map(async recipe => {
                recipe.image = await getImage(recipe.id);
                return recipe;
            });

            const allChefRecipes = await Promise.all(recipesPromise);

            return res.render('main/chef-profile', { chef, recipes: allChefRecipes });
        } catch (err) {
            console.error(err);
        }
    }
};