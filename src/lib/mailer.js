const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "b9aa16be2c5f1a",
        pass: "ad3c58fd8cbf1a"
    }
});