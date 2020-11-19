const crypto = require('crypto');
const { hash } = require('bcryptjs');
const { unlinkSync } = require('fs');

const User = require('../models/User');
const File = require('../models/File');
const loadRecipeService = require('../services/LoadRecipeService');
const mailer = require('../../lib/mailer');
const { emailTemplate, getParams } = require('../../lib/utils');

module.exports = {
    async list(req, res) {
        const params = getParams(req.query, 6);
        const users = await User.pagination(params);
        const pagination = { page: params.page };

        users.length == 0
        ? pagination.total = 1
        : pagination.total = Math.ceil(users[0].total / params.limit);

        const { success } = req.session;

        if (success) {
            res.render('users/list', { users, success, pagination });
            req.session.success = '';
            return
        }

        return res.render('users/list', { users, pagination });
    },
    registerForm(req, res) {
        return res.render('users/register');
    },
    async post(req, res) {
        try {
            let { name, email, is_admin } = req.body;

            is_admin = is_admin || false;

            const userPassword = crypto.randomBytes(3).toString('hex');
            const welcomeEmail = `
                <h2 style="font-size: 24px; font-weight: normal;">Olá <strong>${name}</strong>,</h2>
                <p>Seja muito bem-vindo(a) ao <strong>Foodfy</strong> :)</p>
                <p>Seu cadastro foi realizado com sucesso! Confira seus dados:</p>
                <p>Login: ${email}</p>
                <p>Senha: ${userPassword}</p>
                <br>
                <h3>Como eu acesso minha Conta?</h3>
                <p>
                    Bem simples, você só precisa clicar no botão abaixo e entrar com seu email e senha informados acima.
				</p>
				<p style="text-align: center;">
                    <a
                        style="display: block; margin: 32px auto; padding: 16px; width:150px; color: #fff;
                        background-color: #6558C3; text-decoration: none; border-radius: 4px;"
                        href="http:localhost:5000/admin/users/login" target="_blank"
                    >Acessar</a> 
				</p>
                <p style="padding-top:16px; border-top: 2px solid #ccc">Te esperamos lá!</p>
                <p>Equipe Foodfy.</p>
            `;

            await mailer.sendMail({
                to: req.body.email,
                from: 'no-reply@foodfy.com.br',
                subject: 'Bem-vindo ao Foodfy',
                html: emailTemplate(welcomeEmail)
            });

            const password = await hash(userPassword, 8);

            const userId = await User.create({
                name,
                email,
                password,
                is_admin
            });

            req.session.success = 'Usuário cadastrado com sucesso!';

            return res.redirect(`/admin/users/${userId}/edit`);
        } catch (err) {
            console.error(err);
        }
    },
    async edit(req, res) {
        try {
            const { user } = req;
            user.is_admin = user.is_admin.toString();

            const { success } = req.session;
            
            if (success) {
                res.render('users/edit', { user, success });
                req.session.success = '';
                return
            }

            return res.render('users/edit', { user });
        } catch (err) {
            console.error(err);
        }
    },
    async update(req, res) {
        try {
            let { id, name, email, is_admin } = req.body;
            is_admin = is_admin || false;

            await User.update(id, {
                name,
                email,
                is_admin
            });

            return res.render('users/edit', {
                user: req.body,
                success: 'Usuário atualizado com sucesso!'
            });
        } catch (err) {
            console.error(err);
            return res.render('users/edit', {
                user: req.body,
                error: 'Ops, algum erro aconteceu!'
            });
        }
    },
    async delete(req, res) {
        try {
            const recipes = await loadRecipeService.load('userRecipes', req.body.id);
            const deletedFilesPromise = recipes.map(recipe => {
                recipe.files.map(file => {
                    File.delete({ id: file.file_id });
                    if (file.path != 'public/images/recipe_placeholder.png') {
                        unlinkSync(file.path);
                    }
                });
            });

            await Promise.all(deletedFilesPromise);
            await User.delete({ id: req.body.id });
            req.session.success = 'Usuário excluído com sucesso!';

            return res.redirect('/admin/users');
        } catch (err) {
            console.error(err);
            res.render('users/edit', {
                user: req.body,
                error: 'Ops, algum erro aconteceu!'
            });
        }
    }
}