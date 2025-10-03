const { Pool } = require('pg');

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection error:', err);
  } else {
    console.log('✅ PostgreSQL connected:', res.rows[0].now);
  }
});

// Initialize tables
const initializeDatabase = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS entries (
      id SERIAL PRIMARY KEY,
      date DATE NOT NULL,
      subject VARCHAR(255) NOT NULL,
      hours DECIMAL(5,2) NOT NULL,
      file_link TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  try {
    await pool.query(createTableQuery);
    console.log('✅ Entries table ready');
  } catch (err) {
    console.error('❌ Table creation error:', err);
  }
};

initializeDatabase();

module.exports = pool;