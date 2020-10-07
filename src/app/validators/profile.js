const User = require('../models/User');
const { compare } = require('bcryptjs');

function checkAllFields(body) {
    const keys = Object.keys(body);

    for (let key of keys) {
        if (body[key] == '') {
            return {
                user: body,
                error: 'Por favor, preencha todos os campos!'
            };
        }
    }
}

async function show(req, res, next) {
    const { userId: id } = req.session;
    const user = await User.findOne({ where: { id } });

    if (!user) return res.render('users/login', {
        error: 'Usuário não encontrado!'
    });

    req.user = user;

    next();
}

async function update(req, res, next) {
    const fillAllFields = checkAllFields(req.body);
    if (fillAllFields) return res.render('users/index', fillAllFields);

    const { userId: id } = req.session;
    const user = await User.findOne({ where: { id } });
    const { email, password } = req.body;

    if (email != user.email) {
        const isNotAvaliable = await User.findOne({ where: { email } });
        if (isNotAvaliable) return res.render('users/index', {
            user: req.body,
            error: 'Este email já está cadastrado!'
        });
    }

    if (!password) return res.render('users/index', {
        user: req.body,
        error: 'Insira sua senha para atualizar seu cadastro.'
    });
    
    const passwordPassed = await compare(password, user.password);
    if (!passwordPassed) return res.render('users/index', {
        user: req.body,
        error: 'Senha incorreta!'
    });

    req.user = user;

    next();
}

module.exports = {
    show,
    update
};