const db = require('../../config/db');
const Base = require('./Base');

Base.init({table: 'users'});

module.exports = {
    ...Base,
    async pagination(params) {
        const { limit, offset } = params;
        const query = `
        SELECT *, (
            SELECT count(*) FROM users
        ) AS total
        FROM users
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
        `;

        const results = await db.query(query, [limit, offset]);
        return results.rows;
    },
}