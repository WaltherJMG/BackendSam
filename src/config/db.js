const { Pool } = require('pg');

const dotenv = require('dotenv')
dotenv.config()

// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "Inventario",
//   password: "walther20",
//   port: 5432
// });

const connectionString = process.env.DATABASE_URL

const pool = new Pool({
    connectionString,
    ssl:{
        rejectUnauthorized: false,
    }
})

module.exports = pool;
