import pool from '../config/db.config.js';

const addImageColumn = async () => {
  try {
    await pool.query(`ALTER TABLE mess ADD COLUMN image VARCHAR(200);`);
    await pool.query(`UPDATE mess SET image = 'placeholder';`);
    await pool.query(`ALTER COLUMN image SET NOT NULL;`);

    console.log('✅ image column added to mess table');
  } catch (err) {
    console.error('❌ error adding column:', err);
  }
};

addImageColumn();
