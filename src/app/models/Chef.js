const db = require('../../config/db');
const Base = require('./Base');
const { pagination } = require('./Recipe');

Base.init({ table: 'chefs' });

module.exports = {
    ...Base,
    async pagination(params) {
        const { limit, offset } = params;
        const query = `
        SELECT chefs.*, (
            SELECT count(*) FROM chefs
        ) AS total,
        count(recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        GROUP BY chefs.id
        ORDER BY chefs.created_at DESC
        LIMIT $1 OFFSET $2
        `;

        const results = await db.query(query, [limit, offset]);
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
    }
};