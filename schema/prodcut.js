// create-product-table.js
import pool from '../config/db.config.js';

const createProductTable = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        price NUMERIC NOT NULL,
        in_stock BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await pool.query(query);
    console.log('✅ "products" table created successfully.');
  } catch (error) {
    console.error('❌ Error creating products table:', error);
  } finally {
    await pool.end(); // close DB connection
  }
};

createProductTable();
