const { date } = require('../../lib/utils');
const db = require('../../config/db');

module.exports = {
    all() {
        return db.query(`
        SELECT chefs.*, count(recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        GROUP BY chefs.id
        ORDER BY total_recipes DESC`);
    },
    chefRecipes(id) {
        return db.query(`
        SELECT recipes.*
        FROM recipes
        LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
        WHERE chefs.id = $1`, [id]);
    },
    create(data) {
        const query = `
        INSERT INTO chefs (
            name,
            file_id,
            created_at
        ) Values ($1, $2, $3)
        RETURNING id
        `;

        const values = [
            data.name,
            data.file_id,
            date(Date.now())
        ];

        return db.query(query, values);
    },
    find(id) {
        return db.query(`
        SELECT chefs.*, count(recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        WHERE chefs.id = $1
        GROUP BY chefs.id`, [id]);
    },
    update(data) {
        const query = `
        UPDATE chefs SET
            name=($1),
            avatar_url=($2)
        WHERE id = $3
        `;

        const values = [
            data.name,
            data.avatar_url,
            data.id
        ];

        return db.query(query, values);
    },
    delete(id) {
        return db.query(`DELETE FROM chefs WHERE id = $1`, [id]);
    }
};