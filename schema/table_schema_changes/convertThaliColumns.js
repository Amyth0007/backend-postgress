// convertThaliColumns.js
import pool from '../config/db.config.js'; // Adjust path as needed

const convertThaliColumnsToBoolean = async () => {
  const client = await pool.connect();
  
  try {
    console.log('Starting conversion of thali columns from text to boolean...');

    // Begin transaction
    await client.query('BEGIN');

    // First, add new boolean columns
    console.log('Adding new boolean columns...');
    const addColumnsQuery = `
      ALTER TABLE thalis 
      ADD COLUMN daal_boolean BOOLEAN,
      ADD COLUMN rice_boolean BOOLEAN,
      ADD COLUMN salad_boolean BOOLEAN,
      ADD COLUMN sweet_boolean BOOLEAN;
    `;
    await client.query(addColumnsQuery);
    console.log('✅ New boolean columns added successfully.');

    // Update the new columns based on existing text values
    console.log('Updating new columns with converted values...');
    const updateColumnsQuery = `
      UPDATE thalis 
      SET 
        daal_boolean = CASE WHEN daal = 'yes' THEN TRUE ELSE FALSE END,
        rice_boolean = CASE WHEN rice = 'yes' THEN TRUE ELSE FALSE END,
        salad_boolean = CASE WHEN salad = 'yes' THEN TRUE ELSE FALSE END,
        sweet_boolean = CASE WHEN sweet = 'yes' THEN TRUE ELSE FALSE END;
    `;
    await client.query(updateColumnsQuery);
    console.log('✅ Boolean columns updated with converted values.');

    // Drop the old text columns
    console.log('Dropping old text columns...');
    const dropColumnsQuery = `
      ALTER TABLE thalis 
      DROP COLUMN daal,
      DROP COLUMN rice,
      DROP COLUMN salad,
      DROP COLUMN sweet;
    `;
    await client.query(dropColumnsQuery);
    console.log('✅ Old text columns dropped successfully.');

    // Rename the new boolean columns to the original names
    console.log('Renaming boolean columns to original names...');
    const renameColumnsQuery = `
      ALTER TABLE thalis 
      RENAME COLUMN daal_boolean TO daal;
      
      ALTER TABLE thalis 
      RENAME COLUMN rice_boolean TO rice;
      
      ALTER TABLE thalis 
      RENAME COLUMN salad_boolean TO salad;
      
      ALTER TABLE thalis 
      RENAME COLUMN sweet_boolean TO sweet;
    `;
    await client.query(renameColumnsQuery);
    console.log('✅ Boolean columns renamed to original names.');

    // Add default values
    console.log('Setting default values for boolean columns...');
    const setDefaultsQuery = `
      ALTER TABLE thalis 
      ALTER COLUMN daal SET DEFAULT FALSE,
      ALTER COLUMN rice SET DEFAULT FALSE,
      ALTER COLUMN salad SET DEFAULT FALSE,
      ALTER COLUMN sweet SET DEFAULT FALSE;
    `;
    await client.query(setDefaultsQuery);
    console.log('✅ Default values set for boolean columns.');

    // Commit transaction
    await client.query('COMMIT');
    console.log('✅ All changes committed successfully.');
    console.log('🎉 Thali table columns converted from text to boolean successfully!');

  } catch (error) {
    // Rollback transaction in case of error
    await client.query('ROLLBACK');
    console.error('❌ Error converting thali columns:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

// Run the function
convertThaliColumnsToBoolean()
  .then(() => {
    console.log('Script completed successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });