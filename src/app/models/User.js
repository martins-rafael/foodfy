const db = require('../../config/db');
const { hash } = require('bcryptjs');
const { all } = require('./Recipe');

module.exports = {
    async all() {
        const results = await db.query(`
        SELECT * FROM users
        ORDER BY created_at DESC
        `);

        return results.rows;
    },
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
    async update(id, fields) {
        let query = 'UPDATE users SET';

        Object.keys(fields).map((key, index, array) => {
            if ((index + 1) < array.length) {
                query = `
                ${query}
                ${key} = '${fields[key]}',
                `;
            } else {
                // last iteration
                query = `
                ${query}
                ${key} = '${fields[key]}'
                WHERE id = ${id}
                `;
            }
        });

        return db.query(query);
    },
    async delete(id) {
        return await db.query(`DELETE FROM users WHERE id = $1`, [id]);
    }
}