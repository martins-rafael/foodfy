function onlyUsers(req, res, next) {
    if (!req.session.userId) {
        return res.redirect('/admin/users/login');
    }
    next();
}

module.exports = {
    onlyUsers
};