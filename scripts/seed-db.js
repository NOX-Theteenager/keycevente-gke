const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'keycevente',
});

async function initDatabase() {
  const client = await pool.connect();
  try {
    console.log('Initializing database...');
    
    const sql = fs.readFileSync(path.join(__dirname, 'init-db.sql'), 'utf-8');
    await client.query(sql);
    
    console.log('Database initialized successfully!');
    
    // Verify data
    const result = await client.query('SELECT COUNT(*) FROM products');
    console.log(`Total products: ${result.rows[0].count}`);
    
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

initDatabase();
