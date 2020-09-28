const db = require('../../config/db');
const { hash } = require('bcryptjs');
const { create } = require('browser-sync');

module.exports = {
    async findOne(email) {
        const result = await db.query(`
            SELECT * FROM users
            WHERE email = $1
        `, [email]);

        return result.rows[0];
    },
    async create(data) {
        try {
            const query = `
            INSERT INTO users (
                name,
                email,
                password,
                is_admin
            ) VALUES ($1, $2, $3, $4)
            RETURNING id
            `;

            const passwordHash = await hash(data.password, 8);

            const values = [
                data.name,
                data.email,
                passwordHash,
                data.is_admin || false
            ];

            const results = await db.query(query, values);
            return results.rows[0].id;
        } catch (err) {
            console.error(err);
        }
    }
}