const sql = require('better-sqlite3');
const db = sql('campus.db');

db.prepare(`
   CREATE TABLE IF NOT EXISTS users (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       email TEXT UNIQUE NOT NULL,
       hashed_password TEXT NOT NULL,
       role TEXT CHECK(role IN ('admin', 'user')) NOT NULL
    )
`).run();

db.prepare(`
   CREATE TABLE IF NOT EXISTS grievances (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      agree INTEGER DEFAULT 0,
      disagree INTEGER DEFAULT 0,
      response TEXT,
      image_path TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
`).run();

db.prepare(`
   CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expires_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
`).run();
