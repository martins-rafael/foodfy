const db = require('../../config/db');
const Base = require('./Base');

Base.init({ table: 'chefs' });

module.exports = {
    ...Base,
    async all() {
        const results = await db.query(`
        SELECT chefs.*, count(recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        GROUP BY chefs.id
        ORDER BY chefs.created_at DESC`);

        return results.rows;
    },
    async chefRecipes(id) {
        const results = await db.query(`
        SELECT recipes.*
        FROM recipes
        LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
        WHERE chefs.id = $1
        ORDER BY recipes.created_at DESC`, [id]);

        return results.rows;
    },
    async find(id) {
        const results = await db.query(`
        SELECT chefs.*, count(recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        WHERE chefs.id = $1
        GROUP BY chefs.id`, [id]);

        return results.rows[0];
    },
    async file(id) {
        const results = await db.query(`SELECT * FROM files WHERE id = $1`, [id]);
        return results.rows[0];
    }
};