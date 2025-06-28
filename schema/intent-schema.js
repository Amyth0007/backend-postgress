// create-product-table.js
import pool from '../config/db.config.js';

const createProductTable = async () => {
  try {
      const query = `
      CREATE TABLE intents (
  id SERIAL PRIMARY KEY,
  mess_id INTEGER REFERENCES messes(id),
  user_id INTEGER REFERENCES users(id),
  head_count INTEGER NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  order_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);`;
      const queryforOrderitems = `
    CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES intents(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price_per_unit NUMERIC(10, 2) NOT NULL
);`;


    await pool.query(query);
    await pool.query(queryforOrderitems);
    console.log('✅ "intents" table created successfully.');
    console.log('✅ "order_items" table created successfully.');
  } catch (error) {
    console.error('❌ Error creating products table:', error);
  } finally {
    await pool.end(); // close DB connection
  }
};

createProductTable();
