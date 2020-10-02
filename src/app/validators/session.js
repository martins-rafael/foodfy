const User = require('../models/User');
const { compare } = require('bcryptjs');

async function login(req, res, next) {
    const { email, password } = req.body;

    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(!email.match(mailFormat)) return res.render('session/login', {
        user: req.body,
        error: 'Formato de email inválido!'
    });
    
    const user = await User.findOne({ where: { email } });

    if (!user) return res.render('session/login', {
        user: req.body,
        error: 'Usuário não cadastrado!'
    });

    const passed = await compare(password, user.password);

    if (!passed) return res.render('session/login', {
        user: req.body,
        error: 'Senha incorreta! Tente novamente.'
    });

    req.user = user;

    next();
}

module.exports = {
    login
};