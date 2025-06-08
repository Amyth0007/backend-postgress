
import pool from './../config/db.config.js';
export const getMessaLocation = async (body) => {
  try {
    const result = await pool.query(
      `SELECT * FROM messlocation`
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


