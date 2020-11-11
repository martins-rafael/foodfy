const Chef = require('../models/Chef');
const Recipe = require('../models/Recipe');
const File = require('../models/File');

module.exports = {
    async index(req, res) {
        try {
            const chefs = await Chef.all();

            async function getImage(file_id) {
                const file = await Chef.file(file_id);
                return `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`;
            }

            const chefsPromise = chefs.map(async chef => {
                chef.image = await getImage(chef.file_id);
                return chef;
            });

            const allChefs = await Promise.all(chefsPromise);

            return res.render('admin/chefs/index', { chefs: allChefs });
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

            for (let key of keys) {
                if (req.body[key] == '')
                    return res.send('Por favor, preencha todos os campos.');
            };

            if (req.files.length == 0)
                return res.send('Por favor, envie uma imagem.');

            const { filename, path } = req.files[0];
            const file_id = await File.create({ name: filename, path });

            const { name } = req.body;
            const chefId = await Chef.create({ name, file_id });

            return res.redirect(`/admin/chefs/${chefId}`);
        } catch (err) {
            console.error(err);
        }
    },
    async show(req, res) {
        try {
            const chef = await Chef.find(req.params.id);

            if (!chef) return res.send('Chef não encontrado!');

            const file = await Chef.file(chef.file_id);
            chef.file = file;
            chef.file.src = `${req.protocol}://${req.headers.host}${chef.file.path.replace('public', '')}`;

            const recipes = await Chef.chefRecipes(chef.id);

            async function getImage(recipeId) {
                console.log(recipeId)
                const file = await Recipe.files(recipeId);
                return `${req.protocol}://${req.headers.host}${file[0].path.replace('public', '')}`;
            }

            const recipesPromise = recipes.map(async recipe => {
                recipe.image = await getImage(recipe.id);
                return recipe;
            });

            const allChefRecipes = await Promise.all(recipesPromise);

            return res.render('admin/chefs/show', { chef, recipes: allChefRecipes });
        } catch (err) {
            console.error(err);
        }
    },
    async edit(req, res) {
        try {
            const chef = await Chef.find(req.params.id);

            if (!chef) return res.send('Chef não encontrado!');

            const file = await Chef.file(chef.file_id);
            file.src = `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`;

            return res.render('admin/chefs/edit', { chef, file });
        } catch (err) {
            console.error(err);
        }
    },
    async put(req, res) {
        try {
            const keys = Object.keys(req.body);

            for (let key of keys) {
                if (req.body[key] == '' & key != 'removed_files')
                    return res.send('Por favor, preencha todos os campos.');
            };

            if (req.body.removed_files && req.files == 0)
                return res.send('Por favor, envie uma imagem.');

            let file_id;

            if (req.files.length != 0) {
                const { filename, path } = req.files[0];
                file_id = await File.create({ name: filename, path });
            }

            const { id, name, removed_files } = req.body;
            await Chef.update(id, {
                name,
                file_id: file_id || req.body.file_id
            });

            if (removed_files) {
                const removedFileId = removed_files.replace(',', '');
                await File.deleteFile(removedFileId);
            }

            return res.redirect(`/admin/chefs/${id}`);
        } catch (err) {
            console.error(err);
        }
    },
    async delete(req, res) {
        try {
            await Chef.delete(req.body.id);
            await File.deleteFile(req.body.file_id);

            return res.redirect('/admin/chefs');
        } catch (err) {
            console.error(err);
        }
    }
};