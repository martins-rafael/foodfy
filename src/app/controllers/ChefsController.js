const Chef = require('../models/Chef');
const File = require('../models/File');

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
                if (req.body[key] == '')
                    return res.send('Por favor, preencha todos os campos.');
            });

            if (req.files.length == 0)
                return res.send('Por favor, envie uma imagem.');

            let results = await File.create(req.files[0]);
            const file_id = results.rows[0].id;

            const data = { ...req.body, file_id };
            results = await Chef.create(data);
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

            if (!chef) return res.send('Chef não encontrado!');

            results = await Chef.chefRecipes(req.params.id);
            const recipes = results.rows;

            results = await Chef.file(chef.file_id);
            const file = { ...results.rows[0] };
            file.src = `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`;

            return res.render('admin/chefs/show', { chef, recipes, file });
        } catch (err) {
            console.error(err);
        }
    },
    async edit(req, res) {
        try {
            let results = await Chef.find(req.params.id);
            const chef = results.rows[0];

            if (!chef) return res.send('Chef não encontrado!');

            results = await Chef.file(chef.file_id);
            const file = { ...results.rows[0] };
            file.src = `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`;

            return res.render('admin/chefs/edit', { chef, file });
        } catch (err) {
            console.error(err);
        }
    },
    async put(req, res) {
        try {
            const keys = Object.keys(req.body);

            keys.forEach(key => {
                if (req.body[key] == '' && key != 'removed_files')
                    return res.send('Por favor, preencha todos os campos.');
            });

            if (req.body.removed_files && req.files == 0) 
                return res.send('Por favor, envie uma imagem.');

            let file_id;

            if (req.files.length != 0) {
                const results = await File.create(req.files[0]);
                file_id = results.rows[0].id;
            }

            const data = {
                ...req.body,
                file_id: file_id || req.body.file_id
            };
            await Chef.update(data);

            if (req.body.removed_files) {
                const removedFileId = req.body.removed_files.replace(',', '');
                await File.delete(removedFileId);
            }

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