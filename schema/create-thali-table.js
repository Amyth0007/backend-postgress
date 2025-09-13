// create-thali-table.js
import pool from '../config/db.config.js';

const createThaliTable = async () => {
  let client;
  try {
    // Get a dedicated client from the pool
    client = await pool.connect();

    // Verify the mess table exists first
    const messTableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'mess'
      );
    `);

    if (!messTableExists.rows[0].exists) {
      throw new Error('"mess" table does not exist. Please create it first.');
    }

    // Create the thalis table
    await client.query(`
      CREATE TABLE IF NOT EXISTS thalis (
        id SERIAL PRIMARY KEY,
        mess_id INTEGER NOT NULL REFERENCES mess(id) ON DELETE CASCADE,
        thali_name TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('lunch', 'dinner')),
        published BOOLEAN NOT NULL DEFAULT FALSE,
        editable BOOLEAN NOT NULL DEFAULT TRUE,
        is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
        available_from TIMESTAMPTZ NOT NULL,
        available_until TIMESTAMPTZ NOT NULL,
        rotis INTEGER,
        sabzi TEXT,
        daal TEXT,
        daal_replacement TEXT,
        rice TEXT,
        salad TEXT,
        sweet TEXT,
        sweet_info TEXT,
        other_items TEXT,
        price NUMERIC(10, 2),
        image TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        available_date DATE NOT NULL,
        CONSTRAINT unique_thali_per_mess_per_day 
          UNIQUE (mess_id, type, available_date)
      );
    `);

    console.log('✅ "thalis" table created successfully.');

  } catch (error) {
    console.error('❌ Error creating thali table:', error.message);
  } finally {
    if (client) client.release();
  }
};

createThaliTable();