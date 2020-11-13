const Recipe = require("../app/models/Recipe");

module.exports = {
    emailTemplate(content) {
        return `
        <body style="margin:0;padding:0;font-family: helvetica;color:#444;">
            <table width="100%" align="center" cellpadding="0" cellspacing="0" style="max-width:600px;">
                <tr>
                    <td style="padding:20px 0;" bgcolor="#111" align="center">
                        <img
                            style="display:block;"
                            alt="Logo Foodfy"
                            src="https://raw.githubusercontent.com/martins-rafael/foodfy/master/public/images/logo_admin.png"
                        />
                    </td>
                </tr>
                <tr>
                    <td style="padding:20px;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="padding:30px 0;">
                                    ${content}
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                
                <tr>
                    <td style="padding:15px 10px 15px 10px;" bgcolor="#eee">
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td width="480" style="color:#999;" align="center">Todos direitos reservados, receitas Foodfy</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        `;
    },
    async getImages(recipeId) {
        let files = await Recipe.files(recipeId);
        files = files.map(file => ({
            ...file,
            src: `${file.path.replace('public', '')}`
        }));
        return files;
    }
};