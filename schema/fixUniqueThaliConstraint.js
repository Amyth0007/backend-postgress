import pool from '../config/db.config.js';

const fixThaliUniqueForSoftDelete = async () => {
  try {
    // 1) drop old constraint (safe)
    await pool.query(`
      ALTER TABLE thalis
        DROP CONSTRAINT IF EXISTS unique_thali_per_mess_per_day;
    `);

    // 2) create partial unique index
    await pool.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS unique_thali_per_mess_per_day_active
      ON thalis (mess_id, type, available_date)
      WHERE is_deleted = FALSE;
    `);

    console.log('✅ Updated unique constraint for thalis (supports soft delete)');
  } catch (err) {
    console.error('❌ error updating unique constraint on thalis:', err);
  }
};

fixThaliUniqueForSoftDelete();
