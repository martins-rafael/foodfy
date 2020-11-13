const { checkAllFields } = require('../../lib/utils');

function post(req, res, next) {
    const fillAllFields = checkAllFields(req.body);
    if (fillAllFields) return res.send(fillAllFields.error);

    if (req.files.length == 0) {
        return res.send('Por favor, envie uma imagem.');
    }
    next();
}

function put(req, res, next) {
    const fillAllFields = checkAllFields(req.body);
    if (fillAllFields) return res.send(fillAllFields.error);
    next();
}

module.exports = {
    post,
    put
}