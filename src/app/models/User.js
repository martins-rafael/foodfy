const db = require('../../config/db');
const { hash } = require('bcryptjs');

module.exports = {
    async findOne(filters) {
        let query = 'Select * FROM users';

        Object.keys(filters).map(key => {
            query = `
            ${query}
            ${key}
            `;

            Object.keys(filters[key]).map(field => {
                query = `
                ${query} ${field} = '${filters[key][field]}'
                `;
            });
        });

        const result = await db.query(query);
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
    },
    async update(data){
        const query = `
            UPDATE users SET
                name=($1),
                is_admin=($2)
            WHERE id = $3
        `

        const values = [
            data.name,
            data.is_admin || false,
            data.id
        ];

        return db.query(query, values);
    },
    async delete(id) {
        return await db.query(`DELETE FROM users WHERE id = $1`, [id]);
    }
}