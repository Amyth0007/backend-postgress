import pool from '../../config/db.config.js';

const addAgeAndGenderToUsers = async () => {
  try {
    // Add the new column 'role'
    const addColumnQuery = `
      ALTER TABLE users
      ADD COLUMN role TEXT;
    `;

    await pool.query(addColumnQuery);
    console.log('✅ "role" column added to "users" table successfully.');

    // Set default role as 'customer' for all existing users
    const updateRoleQuery = `
      UPDATE users
      SET role = 'customer';
    `;

    await pool.query(updateRoleQuery);
    console.log('✅ Role set to "customer" for all existing users.');
    
  } catch (error) {
    console.error('❌ Error altering users table:', error);
  } finally {
    await pool.end();
  }
};

addAgeAndGenderToUsers();
