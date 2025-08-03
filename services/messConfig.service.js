
import pool from '../config/db.config.js';
export const getMessaLocation = async (body) => {
  try {
    const result = await pool.query(
      `SELECT * FROM messes`
    );
     const messLocations = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      distance: parseFloat(row.distance),
      rating: parseFloat(row.ratings), 
      city: row.city,
      coordinates: {
        lat: parseFloat(row.latitude),
        lng: parseFloat(row.longitude)
      }
    }));

    return messLocations;
  } catch (err) {
    res.status(500).json({ message: 'Error creating product', error: err.message });
  }
};

export const saveMess = async (body) => {
  try {
    const { name, description, type, city, latitude, longitude, ownerId, address, image } = body;
    const result = await pool.query(
      `INSERT INTO mess (name, description, type, city, latitude, longitude, user_id, address, image) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [name, description, type, city, latitude, longitude, ownerId, address, image]
    );
    return result.rows[0];
  } catch (err) {
    throw new Error('Error saving mess: ' + err.message);
  }
}

export const isMessExistForUser = async (userId) => {
  try {
    const result = await pool.query(
      `SELECT * FROM mess WHERE user_id = $1`,
      [userId]
    );
    return result.rows.length > 0;
  } catch (err) {
    throw new Error('Error checking if mess exists: ' + err.message);
  }
}


