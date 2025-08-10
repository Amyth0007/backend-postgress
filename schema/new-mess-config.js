import pool from '../config/db.config.js';


const createMessTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS mess (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      type VARCHAR(100) NOT NULL,
      city VARCHAR(100) NOT NULL,
      image VARCHAR(100) NOT NULL,
      latitude FLOAT NOT NULL,
      longitude FLOAT NOT NULL,
      ratings FLOAT,
      user_id INT NOT NULL,
      address TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `;
  try {
    await pool.query(query);
    console.log('✅ "mess" table created successfully.');
  } catch (error) {
    console.error('❌ Error creating "mess" table:', error);
  }
  await pool.query(query);
};
createMessTable();
