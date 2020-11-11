const Recipe = require('../models/Recipe');

function onlyUsers(req, res, next) {
    if (!req.session.userId) {
        return res.redirect('/admin/users/login');
    }
    next();
}

function isLoggedRedirectToProfile(req, res, next) {
    if (req.session.userId) {
        return res.redirect('/admin/users/profile');
    }

    next();
}

function isAdmin(req, res, next) {
    if (!req.session.isAdmin) {
        req.session.error = 'Descupe, você não tem permisão para acessar esta página!'
        return res.redirect('/admin/users/profile');
    }

    next();
}

async function isCreator(req, res, next) {
    const recipe = await Recipe.find(req.params.id);

    if(req.session.userId != recipe.user_id && !req.session.isAdmin) {
        req.session.error = 'Descupe, você não tem permisão para acessar esta página!'
        return res.redirect('/admin/users/profile');
    }

    next();
}

module.exports = {
    onlyUsers,
    isLoggedRedirectToProfile,
    isAdmin,
    isCreator
};