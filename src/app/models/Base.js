const db = require('../../config/db');

const Base = {
    init({ table }) {
        if (!table) throw new Error('Invalid Params!');
        this.table = table;

        return this;
    },
    async findOne(filters) {
        let query = `SELECT * FROM ${this.table}`;

        Object.keys(filters).map(key => {
            query += ` ${key}`;

            Object.keys(filters[key]).map(field => {
                query += ` ${field} = '${filters[key][field]}'`
            });
        });

        const results = await db.query(query);
        return results.rows[0];
    },
    async create(fields) {
        try {
            let keys = [], values = [];

            Object.keys(fields).map(key => {
                keys.push(key);

                Array.isArray(fields[key])
                ? values.push(`'{"${fields[key].join('","')}"}'`)
                : values.push(`'${fields[key]}'`);
            });

            const query = `
                INSERT INTO ${this.table}
                (${keys.join(',')})
                VALUES(${values.join(',')})
                RETURNING id
            `;

            const results = await db.query(query);
            return results.rows[0].id;
        } catch (err) {
            console.error(err);
        }
    },
    update(id, fields) {
        try {
            let update = [];

            Object.keys(fields).map(key => {
                let line;

                Array.isArray(fields[key])
                ? line = `${key} = '{"${fields[key].join('","')}"}'`
                : line = `${key} = '${fields[key]}'`;
                update.push(line);
            });

            const query = `
                UPDATE ${this.table} SET
                ${update.join(',')}
                WHERE id = ${id}
            `;

            return db.query(query);
        } catch (err) {
            console.error(err);
        }
    },
    delete(field) {
        let exclude;

        Object.keys(field).map(key => {
            exclude = `${key} = '${field[key]}'`;
        });

        return db.query(`DELETE FROM ${this.table} WHERE ${exclude}`);
    }
}

module.exports = Base;