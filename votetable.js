import db from "./src/lib/db.js";


db.prepare(`
    CREATE TABLE IF NOT EXISTS grievance_votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      grievance_id INTEGER NOT NULL,
      vote TEXT CHECK(vote IN ('agree', 'disagree')) NOT NULL,
      UNIQUE(user_id, grievance_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (grievance_id) REFERENCES grievances(id)
    )
`).run();


