const { Pool } = require('pg');

module.exports = new Pool({
    user: 'postgres',
    password: '0000',
    host: 'localhost',
    port: 5432,
    database: 'foodfy'
});