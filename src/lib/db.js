const sql = require('better-sqlite3');
const db = sql('campus.db');

module.exports = db;