import pool from '../../config/db.config.js';

const updateIntentFK = async () => {
  try {
    console.log("🔄 Updating foreign key reference from 'messes' to 'mess'...");

    const dropConstraint = `
      ALTER TABLE intents
      DROP CONSTRAINT IF EXISTS intents_mess_id_fkey;
    `;

    const addConstraint = `
      ALTER TABLE intents
      ADD CONSTRAINT intents_mess_id_fkey
      FOREIGN KEY (mess_id) REFERENCES mess(id);
    `;

    await pool.query(dropConstraint);
    await pool.query(addConstraint);

    console.log("✅ Foreign key updated to reference 'mess(id)'");
  } catch (error) {
    console.error("❌ Error updating foreign key:", error);
  } finally {
    await pool.end();
  }
};

updateIntentFK();
