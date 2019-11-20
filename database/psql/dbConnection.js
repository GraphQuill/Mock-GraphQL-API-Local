const { Pool } = require('pg');

const yourUsername = 'graphquill';
const yourPassword = 'graphquill';

// start a new pool of connections
const pool = new Pool({
  connectionString: `postgres://${yourUsername}:${yourPassword}!!@localhost/graphquillpsql`,
});

// export the pool, it can be queried directly, or clients/connections can be "checked out",
// the connection/client can be queried, and then "released"
module.exports = pool;
