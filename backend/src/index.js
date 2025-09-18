const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/../.env' });
const routes = require('./routes');
const pool = require('./db');

app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Backend listening on ${PORT}`);
  // ensure users table exists
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Ensured users table');
  } catch (err) {
    console.error('Error ensuring users table', err);
  }
});
