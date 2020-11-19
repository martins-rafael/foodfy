const { unlinkSync } = require('fs');

const Chef = require('../models/Chef');
const File = require('../models/File');
const loadChefService = require('../services/LoadChefService');
const { getParams } = require('../../lib/utils');

module.exports = {
    async index(req, res) {
        try {
            const params = getParams(req.query, 12);
            const chefs = await loadChefService.load('chefs', params);
            const pagination = { page: params.page };

            chefs.length == 0
            ? pagination.total = 1
            : pagination.total = Math.ceil(chefs[0].total / params.limit);

            const { success } = req.session;

            if (success) {
                res.render('admin/chefs/index', { chefs, pagination, success });
                req.session.success = '';
                return
            }

            return res.render('admin/chefs/index', { chefs, pagination });
        } catch (err) {
            console.error(err);
        }
    },
    create(req, res) {
        return res.render('admin/chefs/create');
    },
    async post(req, res) {
        try {
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
            const chef = await loadChefService.load('chef', req.params.id);
            if (!chef) return res.send('Chef não encontrado!');
            return res.render('admin/chefs/show', { chef });
        } catch (err) {
            console.error(err);
        }
    },
    async edit(req, res) {
        try {
            const chef = await loadChefService.load('chef', req.params.id);
            if (!chef) return res.send('Chef não encontrado!');
            return res.render('admin/chefs/edit', { chef });
        } catch (err) {
            console.error(err);
        }
    },
    async put(req, res) {
        try {
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
                const file = await File.findOne({ where: { id: removedFileId } });
                await File.delete({ id: removedFileId });
                if (file.path != 'public/images/chef_placeholder.png') {
                    unlinkSync(file.path);
                }
            }

            return res.redirect(`/admin/chefs/${id}`);
        } catch (err) {
            console.error(err);
        }
    },
    async delete(req, res) {
        try {
            await Chef.delete({ id: req.body.id });
            const file = await File.findOne({ where: { id: req.body.file_id } });
            await File.delete({id: file.id});
            if (file.path != 'public/images/chef_placeholder.png') {
                unlinkSync(file.path);
            }

            req.session.success = 'Chef excluído com sucesso!';
            return res.redirect('/admin/chefs');
        } catch (err) {
            console.error(err);
        }
    }
};