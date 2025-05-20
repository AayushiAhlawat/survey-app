const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory');

db.serialize(() => {
    db.run(`
  CREATE TABLE IF NOT EXISTS responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    answers TEXT NOT NULL
  )
`);
});

module.exports = db;