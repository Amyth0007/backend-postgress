import pool from '../../config/db.config.js';

const addAgeAndGenderToUsers = async () => {
  try {
    const query = `
      ALTER TABLE users
      ADD COLUMN age INTEGER,
      ADD COLUMN gender TEXT;
    `;

    await pool.query(query);
    console.log('✅ "age" and "gender" columns added to "users" table successfully.');
  } catch (error) {
    console.error('❌ Error altering users table:', error);
  } finally {
    await pool.end();
  }
};

addAgeAndGenderToUsers();
