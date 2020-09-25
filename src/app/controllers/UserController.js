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
            const { email } = req.body;
            const user = await User.findOne({ where: { email } });

            if (user) return res.send('Este usuário já está cadastrado!');
            
            return res.redirect('/admin/users');
        } catch (err) {
            console.error(err);
        }
    }
}