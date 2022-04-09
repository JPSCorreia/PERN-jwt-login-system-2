const Pool = require('pg').Pool;

const PGUSER = "correia"
const PGHOST = "localhost"
const PGDATABASE = "jwttutorial"
const PGPASSWORD = "DevPassword22"
const PGPORT = "5432"

const pool = new Pool({
  user: PGUSER,
  password: PGPASSWORD,
  host: PGHOST,
  port: PGPORT,
  database: PGDATABASE
})

module.exports = pool;