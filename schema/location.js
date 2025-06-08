// create-product-table.js
import pool from '../config/db.config.js';

const createProductTable = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS messlocation (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        city VARCHAR(100) NOT NULL,
        description VARCHAR(100) NOT NULL,
        ratings NUMERIC NOT NULL,
        distance NUMERIC NOT NULL,
        latitude NUMERIC NOT NULL,
        longitude NUMERIC NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await pool.query(query);
    console.log('✅ "messlocation" table created successfully.');
  } catch (error) {
    console.error('❌ Error creating messlocation table:', error);
  } finally {
    await pool.end(); // close DB connection
  }
};

createProductTable();
