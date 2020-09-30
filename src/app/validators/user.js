const User = require('../models/User');

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

async function post(req, res, next) {
    // check if has all fields //
    const fillAllFields = checkAllFields(req.body);
    if (fillAllFields) return res.render('users/register', fillAllFields);

    // check if user alread exists //
    const { email } = req.body;
    const user = await User.findOne(email);
    if (user) return res.render('users/register', {
        user: req.body,
        error: 'Este usuário já está cadastrado!'
    });

    // check email format //
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email.match(mailFormat)) {
        return res.render('users/register', {
            user: req.body,
            error: 'Formato de email inválido!'
        });
    }

    next();
}

module.exports = {
    post
};