const Pool = require("pg").Pool;
const dotenv = require("dotenv");
dotenv.config();

const pool = new Pool({
    user: process.env.POSTGRESDB_USER,
    database: process.env.POSTGRESDB_DATABASE,
    password: process.env.POSTGRESDB_ROOT_PASSWORD,
    port: process.env.POSTGRESDB_DOCKER_PORT,
    host: 'postgresdb'
});

pool.on("connect", () => {
  console.log("connected to the db");
});

module.exports = {
  pool
};