const User = require('../models/User');

module.exports = {
    index(req, res) {
        const { user } = req;
        const { error } = req.session;

        if (error) {
            res.render('users/index', { user, error });
            req.session.error = '';
            return;
        }
        
        return res.render('users/index', { user });
    },
    async update(req, res) {
        try {
            const { user } = req;
            const { name, email } = req.body;

            await User.update(user.id, { name, email });

            return res.render('users/index', {
                user: req.body,
                success: 'Sua conta foi atualizada com sucesso!'
            });
        } catch (err) {
            console.error(err);
        }
    }
}