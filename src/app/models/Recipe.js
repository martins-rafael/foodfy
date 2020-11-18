const db = require('../../config/db');
const Base = require('./Base');

Base.init({ table: 'recipes' });

module.exports = {
    ...Base,
    async all() {
        const results = await db.query(`
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        ORDER BY created_at DESC`);

        return results.rows;
    },
    async chefsSelectOptions() {
        const results = await db.query(`SELECT id, name FROM chefs`);
        return results.rows;
    },
    async find(id) {
        const results = await db.query(`
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.id = $1`, [id]);

        return results.rows[0];
    },
    async pagination(params) {
        let { search, limit, offset, id } = params;
        let query = '',
            filterQuery = '',
            totalQuery = `(
                SELECT count(*) FROM recipes
            ) AS total`,
            orderBy = 'ORDER BY recipes.created_at DESC';

        if (search) {
            filterQuery = `WHERE recipes.title ILIKE '%${search}%'`;

            totalQuery = `(
                SELECT count(*) FROM recipes
                ${filterQuery}
            ) AS total`;

            orderBy = 'ORDER BY recipes.updated_at DESC'
        }
        if (id) {
            filterQuery = `WHERE user_id = ${id}`;

            totalQuery = `(
                SELECT count(*) FROM recipes
                ${filterQuery}
            ) AS total`;
        }

        query = `
        SELECT recipes.*, ${totalQuery}, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        ${filterQuery}
        ${orderBy}
        LIMIT $1 OFFSET $2
        `;

        const results = await db.query(query, [limit, offset]);
        return results.rows;
    },
    async userRecipes(id) {
        const results = await db.query(`
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE user_id = $1
        ORDER BY created_at DESC`, [id]);

        return results.rows;
    },
    async files(id) {
        const results = await db.query(`
        SELECT recipe_files.*,
        files.name AS name, files.path AS path, files.id AS file_id
        FROM recipe_files
        LEFT JOIN files ON (recipe_files.file_id = files.id)
        WHERE recipe_files.recipe_id = $1`, [id]);

        return results.rows;
    }
};