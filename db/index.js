const {Pool} = require('pg');
require('dotenv').config()

const pool = new Pool({
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DATABASE,
    port: process.env.PORT_DB,
    password: process.env.PASSWORD,
    ssl: {
        rejectUnauthorized:false
    }
});

module.exports = {
    query: async (text, params) => {
        const res = await pool.query(text, params);
        return res;
    },
    pool: pool
}