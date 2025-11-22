import pool from './../config/db.config.js'

export const addThali = async (thaliData, userId) => {
  const client = await pool.connect();
  let messID = await getMessIdByUserId(userId);

  try {
    const {
      thali_name,
      type,
      published,
      editable,
      available_from,
      available_until,
      rotis,
      sabzi,
      daal, // This will be 'yes' or 'no' from frontend
      daal_replacement,
      rice, // This will be 'yes' or 'no' from frontend
      salad, // This will be 'yes' or 'no' from frontend
      sweet, // This will be 'yes' or 'no' from frontend
      sweet_info,
      other_items,
      price,
      image
    } = thaliData;

    await client.query('BEGIN');

    // Set available_date to current date
    const today = new Date();
    const available_date = today.toLocaleDateString('en-CA');

    // Convert 'yes'/'no' strings to boolean for database
    const daalBoolean = daal === 'yes';
    const riceBoolean = rice === 'yes';
    const saladBoolean = salad === 'yes';
    const sweetBoolean = sweet === 'yes';

    // Check if thali already exists for this mess, type, and current date
    const checkQuery = `
      SELECT id FROM thalis 
      WHERE mess_id = $1 AND type = $2 AND available_date = $3 AND is_deleted = false
    `;
    const checkResult = await client.query(checkQuery, [messID, type, available_date]);

    if (checkResult.rows.length > 0) {
      throw new Error('A thali already exists for this mess and type today');
    }

    // Insert into thalis table with boolean values
    const insertQuery = `
      INSERT INTO thalis (
        mess_id, thali_name, type, published, editable, available_from, 
        available_until, rotis, sabzi, daal, daal_replacement, rice, salad, 
        sweet, sweet_info, other_items, price, image, available_date
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING id
    `;

    const result = await client.query(insertQuery, [
      messID,
      thali_name,
      type,
      published || false,
      editable || true,
      available_from,
      available_until,
      rotis,
      sabzi,
      daalBoolean, // Store as boolean
      daal_replacement,
      riceBoolean, // Store as boolean
      saladBoolean, // Store as boolean
      sweetBoolean, // Store as boolean
      sweet_info,
      other_items,
      price,
      image,
      available_date
    ]);

    const thaliId = result.rows[0].id;

    await client.query('COMMIT');

    return { success: true, thaliId };
  } catch (error) {
    console.log(error.message);
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const getMessIdByUserId = async (userId) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT id FROM mess WHERE user_id = $1', [userId]);
    
    return result.rows[0].id;
  }
  catch (error) {
    console.error('Error fetching mess id by user id:', error);
    throw error;
  }
  finally {
    client.release();
  }
}

export const updateThali = async (thaliId, thaliData) => {
  const client = await pool.connect();

  try {
    const {
      thali_name,
      published,
      editable,
      available_from,
      available_until,
      rotis,
      sabzi,
      daal, // This will be 'yes' or 'no' from frontend
      daal_replacement,
      rice, // This will be 'yes' or 'no' from frontend
      salad, // This will be 'yes' or 'no' from frontend
      sweet, // This will be 'yes' or 'no' from frontend
      sweet_info,
      other_items,
      price,
      image
    } = thaliData;

    await client.query('BEGIN');

    // Convert 'yes'/'no' strings to boolean for database
    const daalBoolean = daal === 'yes';
    const riceBoolean = rice === 'yes';
    const saladBoolean = salad === 'yes';
    const sweetBoolean = sweet === 'yes';

    // Update thali with boolean values
    const updateQuery = `
      UPDATE thalis 
      SET 
        thali_name = $1,
        published = $2,
        editable = $3,
        available_from = $4,
        available_until = $5,
        rotis = $6,
        sabzi = $7,
        daal = $8,
        daal_replacement = $9,
        rice = $10,
        salad = $11,
        sweet = $12,
        sweet_info = $13,
        other_items = $14,
        price = $15,
        image = $16,
        updated_at = NOW()
      WHERE id = $17 AND is_deleted = false
      RETURNING id
    `;

    const result = await client.query(updateQuery, [
      thali_name,
      published,
      editable,
      available_from,
      available_until,
      rotis,
      sabzi,
      daalBoolean, // Store as boolean
      daal_replacement,
      riceBoolean, // Store as boolean
      saladBoolean, // Store as boolean
      sweetBoolean, // Store as boolean
      sweet_info,
      other_items,
      price,
      image,
      thaliId
    ]);

    if (result.rows.length === 0) {
      throw new Error('Thali not found or already deleted');
    }

    await client.query('COMMIT');

    return { success: true };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const deleteThali = async (thaliId) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Soft delete - set is_deleted to true
    const deleteQuery = `
      UPDATE thalis 
      SET is_deleted = true, updated_at = NOW() 
      WHERE id = $1 AND is_deleted = false
      RETURNING id
    `;

    const result = await client.query(deleteQuery, [thaliId]);

    if (result.rows.length === 0) {
      throw new Error('Thali not found or already deleted');
    }

    await client.query('COMMIT');

    return { success: true };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const getThalis = async (messId, type) => {
  try {
    let query = `
  SELECT 
    t.id,
    t.mess_id,
    t.thali_name,
    t.type,
    t.published,
    t.editable,
    t.is_deleted,
    t.available_from,
    t.available_until,
    t.rotis,
    t.sabzi,
    t.daal,
    t.daal_replacement,
    t.rice,
    t.salad,
    t.sweet,
    t.sweet_info,
    t.other_items,
    t.price,
    t.image,
    t.created_at,
    t.updated_at,
    to_char(t.available_date, 'YYYY-MM-DD') as available_date, -- ✅ normalized
    m.name as mess_name,
    m.city as mess_city,
    m.address as mess_address
  FROM thalis t
  JOIN mess m ON t.mess_id = m.id
  WHERE t.is_deleted = false
`;




    let params = [];
    let paramCount = 0;

    if (messId) {
      paramCount++;
      query += ` AND t.mess_id = $${paramCount}`;
      params.push(messId);
    }

    if (type) {
      paramCount++;
      query += ` AND t.type = $${paramCount}`;
      params.push(type);
    }

    // No date filtering on backend - we do it all client-side
    query += ' ORDER BY t.available_date DESC, t.type';

    const result = await pool.query(query, params);

    // Convert boolean values back to 'yes'/'no' strings for frontend
    const thalisWithStringValues = result.rows.map(thali => ({
      ...thali,
      daal: thali.daal ? 'yes' : 'no',
      rice: thali.rice ? 'yes' : 'no',
      salad: thali.salad ? 'yes' : 'no',
      sweet: thali.sweet ? 'yes' : 'no',
      available_date: thali.available_date // stays "YYYY-MM-DD"
    }));

    return thalisWithStringValues;

  } catch (error) {
    console.error('Error fetching thalis:', error);
    throw error;
  }
};

export function getTodayDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // months are 0-based
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
export const getMessSpecificThali = async (messId, type) => {
  try {
  //  const result = await pool.query("SELECT * FROM thalis WHERE mess_id = $1 AND available_date = (NOW() AT TIME ZONE 'Asia/Kolkata');", [messId]);
  const today = getTodayDate()
  const result = await pool.query(
  "SELECT * FROM thalis WHERE mess_id = $1 AND available_date = $2 AND published = $3",
  [messId, today, true]
);
  const thalis = result.rows.map(mapThaliToFrontend);

    return thalis;

  } catch (error) {
    console.error('Error fetching thalis:', error);
    throw error;
  }
};
function mapThaliToFrontend(thali) {
  const items = [];

  if (thali.rotis) items.push(`${thali.rotis} rotis`);
  if (thali.sabzi) items.push(`sabzi: ${thali.sabzi}`);
  if (thali.daal === "true") items.push("daal");
  if (thali.rice === "true") items.push("rice");
  if (thali.salad === "true") items.push("salad");
  if (thali.sweet === "true") {
    items.push(`sweet: ${thali.sweet_info || "included"}`);
  }
  if (thali.other_items) items.push(`other items: ${thali.other_items}`);

  return {
    id: thali.id,
    name: thali.thali_name,
    description: `Includes ${items.join(", ")}.`,
    price: parseFloat(thali.price),
    imageUrl: thali.image,
    isVegetarian: true, // hardcoded for now
    spicyLevel: 2       // hardcoded
  };
}

export const publishThali = async (thaliId, published) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const updateQuery = `
      UPDATE thalis 
      SET published = $1, updated_at = NOW()
      WHERE id = $2 AND is_deleted = false
      RETURNING id
    `;

    const result = await client.query(updateQuery, [published, thaliId]);

    if (result.rows.length === 0) {
      throw new Error('Thali not found or already deleted');
    }

    await client.query('COMMIT');

    return { success: true };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};