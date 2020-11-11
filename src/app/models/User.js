const db = require('../../config/db');
const Base = require('./Base');

Base.init({table: 'users'});

module.exports = {
    ...Base,
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
            query += ` ${key}`;

            Object.keys(filters[key]).map(field => {
                query += ` ${field} = '${filters[key][field]}'`;
            });
        });

        const result = await db.query(query);
        return result.rows[0];
    }
}