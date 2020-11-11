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
    }
}