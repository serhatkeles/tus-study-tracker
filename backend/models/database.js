const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = process.env.DB_PATH || './db/study_tracker.db';

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Database bağlantı hatası:', err.message);
  } else {
    console.log('✅ SQLite database\'e bağlanıldı:', DB_PATH);
  }
});

const initializeDatabase = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      subject TEXT NOT NULL,
      hours REAL NOT NULL,
      file_link TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('❌ Tablo oluşturma hatası:', err.message);
    } else {
      console.log('✅ Entries tablosu hazır');
    }
  });
};

initializeDatabase();

module.exports = db;