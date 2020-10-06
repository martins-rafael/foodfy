module.exports = {
    index(req, res) {
        const { user } = req;
        return res.render('users/index', { user });
    }
}