const { Pool } = require('pg');

module.exports = new Pool({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD ||  '0000',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'foodfy'
});