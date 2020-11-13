const { unlinkSync } = require('fs');

const Recipe = require('../models/Recipe');
const File = require('../models/File');
const RecipeFile = require('../models/RecipeFile');
const loadRecipeService = require('../services/LoadRecipeService');

module.exports = {
    async index(req, res) {
        try {
            const recipes = await loadRecipeService.load('recipes');
            return res.render('admin/recipes/index', { recipes });
        } catch (err) {
            console.error(err);
        }
    },
    async userRecipes(req, res) {
        try {
            const recipes = await loadRecipeService.load('userRecipes', req.session.userId);
            return res.render('admin/recipes/index', { recipes });
        } catch (err) {
            console.error(err);
        }
    },
    async create(req, res) {
        try {
            const chefsOptions = await Recipe.chefsSelectOptions();
            return res.render('admin/recipes/create', { chefsOptions });
        } catch (err) {
            console.error(err);
        }
    },
    async post(req, res) {
        try {
            const { chef: chef_id, title, ingredients,
                preparation, information } = req.body;

            const recipe_id = await Recipe.create({
                chef_id,
                user_id: req.session.userId,
                title,
                ingredients,
                preparation,
                information
            });

            const filesPromise = req.files.map(async file => {
                const file_id = await File.create({
                    name: file.filename,
                    path: file.path
                });
                await RecipeFile.create({
                    file_id,
                    recipe_id
                });
            });

            await Promise.all(filesPromise);

            return res.redirect(`/admin/recipes/${recipe_id}`);
        } catch (err) {
            console.error(err);
        }
    },
    async show(req, res) {
        try {
            const recipe = await loadRecipeService.load('recipe', req.params.id);
            if (!recipe) return res.send('Receita não encontrada!');
            return res.render('admin/recipes/show', { recipe });
        } catch (err) {
            console.error(err);
        }
    },
    async edit(req, res) {
        try {
            const recipe = await loadRecipeService.load('recipe', req.params.id);
            if (!recipe) return res.send('Receita não encontrada!');
            const chefsOptions = await Recipe.chefsSelectOptions();
            return res.render('admin/recipes/edit', { recipe, chefsOptions });
        } catch (err) {
            console.error(err);
        }
    },
    async put(req, res) {
        try {
            let { id, removed_files, chef: chef_id, title, ingredients,
                preparation, information } = req.body;

            if (req.files.length != 0) {
                const newFilesPromise = req.files.map(async file => {
                    const file_id = await File.create({
                        name: file.filename,
                        path: file.path
                    });
                    await RecipeFile.create({
                        file_id,
                        recipe_id: id
                    });
                });

                await Promise.all(newFilesPromise);
            }

            if (removed_files) {
                removed_files = removed_files.split(',');
                const lastIndex = removed_files.length - 1;
                removed_files.splice(lastIndex, 1);

                const removedFilesPromise = removed_files.map(async id => {
                    RecipeFile.delete({ file_id: id });
                    
                    const file = await File.findOne({ where: { id } });
                    File.delete({ id });
                    unlinkSync(file.path);
                });

                await Promise.all(removedFilesPromise);
            }

            await Recipe.update(id, {
                chef_id,
                title,
                ingredients,
                preparation,
                information
            });

            return res.redirect(`/admin/recipes/${id}`);
        } catch (err) {
            console.error(err);
        }
    },
    async delete(req, res) {
        try {
            const files = await Recipe.files(req.body.id);
            
            const deletedFilesPromise = files.map(file => {
                RecipeFile.delete({ file_id: file.file_id });
                File.delete({ id: file.file_id });
                unlinkSync(file.path);
            });

            await Promise.all(deletedFilesPromise);
            await Recipe.delete({ id: req.body.id });

            return res.redirect('/admin');
        } catch (err) {
            console.error(err);
        }
    }
};