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

db.prepare(`
    CREATE TABLE IF NOT EXISTS surveys (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        admin_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (admin_id) REFERENCES users(id) 
    )
`).run();

db.prepare(`
    CREATE TABLE IF NOT EXISTS survey_questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        survey_id INTEGER NOT NULL,
        question_text TEXT NOT NULL,
        input_type TEXT NOT NULL,
        options
        FOREIGN KEY (survey_id) REFERENCES surveys(id) 
    )
`).run();

