const User = require('../models/User');
const crypto = require('crypto');
const mailer = require('../../lib/mailer');

module.exports = {
    registerForm(req, res) {
        return res.render('users/register');
    },
    async post(req, res) {
        try {
            const keys = Object.keys(req.body);

            for (let key of keys) {
                if (req.body[key] == '')
                    return res.send('Por favor, preencha todos os campos.');
            }

            // check if user already exists
            const { email, name } = req.body;
            const user = await User.findOne(email);

            if (user) return res.send('Este usuário já está cadastrado!');
            
            const password = crypto.randomBytes(6).toString('hex');
            const data = {
                ...req.body,
                password
            };

            await mailer.sendMail({
                to: email,
                from: 'no-reply@foodfy.com.br',
                subject: 'Bem-vindo ao Foodfy',
                html: `
                <h2>Olá <strong>${name}</strong>,</h2>
                <p>Seja muito bem-vindo ao <strong>Foodfy</strong> :)</p>
                <p>Seu cadastro foi realizado com sucesso! Confira seus dados:</p>
                <p>Login: ${email}</p>
                <p>Senha: ${password}</p>
                <br>
                <h3>Como eu acesso minha Conta?</h3>
                <p>
                    Bem simples, você só precisa clicar
                    <a href="http:localhost:5000/admin/users/login" target="_blank">aqui</a> e entrar com seu email e senha informados acima.
                </p>
                <br><br>
                <p>Te esperamos lá!</p>
                <p>Equipe Foodfy.<p>
                `
            });

            const userID = await User.create(data);

            return res.send('Success!');
        } catch (err) {
            console.error(err);
        }
    }
}