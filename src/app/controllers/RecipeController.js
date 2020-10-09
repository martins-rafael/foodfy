const Recipe = require('../models/Recipe');
const File = require('../models/File');
const RecipeFile = require('../models/RecipeFile');

module.exports = {
    async index(req, res) {
        try {
            const results = await Recipe.all();
            const recipes = results.rows;

            async function getImage(recipeId) {
                let results = await Recipe.files(recipeId);
                const file = results.rows[0];

                return `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`;
            }

            const recipesPromise = recipes.map(async recipe => {
                recipe.image = await getImage(recipe.id);
                return recipe;
            });

            const allRecipes = await Promise.all(recipesPromise);

            return res.render('admin/recipes/index', { recipes: allRecipes });
        } catch (err) {
            console.error(err);
        }
    },
    async recipes(req, res) {
        try {
            const results = await Recipe.userRecipes(req.session.userId);
            const recipes = results.rows;

            async function getImage(recipeId) {
                let results = await Recipe.files(recipeId);
                const file = results.rows[0];

                return `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`;
            }

            const recipesPromise = recipes.map(async recipe => {
                recipe.image = await getImage(recipe.id);
                return recipe;
            });

            const allRecipes = await Promise.all(recipesPromise);

            return res.render('admin/recipes/index', { recipes: allRecipes });
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

            for (let key of keys) {
                if (req.body[key] == '')
                    return res.send('Por favor, preencha todos os campos.');
            };

            if (req.files.length == 0)
                return res.send('Por favor, envie pelo menos uma imagem.');

            let results = await Recipe.create({
                ...req.body,
                user_id: req.session.userId
            });
            
            const recipeId = results.rows[0].id;

            const filesPromise = req.files.map(async file => {
                const results = await File.create(file);
                const file_id = results.rows[0].id;
                const data = {
                    file_id,
                    recipe_id: recipeId
                };

                await RecipeFile.create(data);
            });

            await Promise.all(filesPromise);

            return res.redirect(`/admin/recipes/${recipeId}`);
        } catch (err) {
            console.error(err);
        }
    },
    async show(req, res) {
        try {
            let results = await Recipe.find(req.params.id);
            const recipe = results.rows[0];

            if (!recipe) return res.send('Receita não encontrada!');

            results = await Recipe.files(recipe.id);
            let files = results.rows;
            files = files.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
            }));

            return res.render('admin/recipes/show', { recipe, files });
        } catch (err) {
            console.error(err);
        }
    },
    async edit(req, res) {
        try {
            let results = await Recipe.find(req.params.id);
            const recipe = results.rows[0];

            if (!recipe) return res.send('Receita não encontrada!');

            results = await Recipe.chefsSelectOptions();
            const chefsOptions = results.rows;

            results = await Recipe.files(recipe.id);
            let files = results.rows;
            files = files.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
            }));

            return res.render('admin/recipes/edit', { recipe, chefsOptions, files });
        } catch (err) {
            console.error(err);
        }
    },
    async put(req, res) {
        try {
            const keys = Object.keys(req.body);

            for (let key of keys) {
                if (req.body[key] == '' && key != 'removed_files')
                    return res.send('Por favor, preencha todos os campos.');
            };

            if (req.files.length != 0) {
                const newFilesPromise = req.files.map(async file => {
                    const results = await File.create(file);
                    const file_id = results.rows[0].id;
                    const data = {
                        file_id,
                        recipe_id: req.body.id
                    };

                    await RecipeFile.create(data);
                });

                await Promise.all(newFilesPromise);
            }

            if (req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(',');
                const lastIndex = removedFiles.length - 1;
                removedFiles.splice(lastIndex, 1);

                const removedFilesPromise = removedFiles.map(id => {
                    RecipeFile.delete(id);
                    File.delete(id);
                });

                await Promise.all(removedFilesPromise);
            }

            await Recipe.update(req.body);

            return res.redirect(`/admin/recipes/${req.body.id}`);
        } catch (err) {
            console.error(err);
        }
    },
    async delete(req, res) {
        try {
            let results = await Recipe.files(req.body.id);
            const files = results.rows;
            const deletedFilesPromise = files.map(file => {
                RecipeFile.delete(file.file_id);
                File.delete(file.file_id);
            });

            await Promise.all(deletedFilesPromise);
            await Recipe.delete(req.body.id);

            return res.redirect('/admin');
        } catch (err) {
            console.error(err);
        }
    }
};