
import pool from './../config/db.config.js';
export const saveProduct = async (body) => {
  try {
    const { name, price, in_stock } = body;
    const result = await pool.query(
      `INSERT INTO products (name, price, in_stock) VALUES ($1, $2, $3) RETURNING *`,
      [name, price, in_stock]
    );
   
    return result.rows[0];
  } catch (err) {
    res.status(500).json({ message: 'Error creating product', error: err.message });
  }
};

export const getProduct = async (body) => {
  try {
    const result = await pool.query(
      `SELECT  * FROM products ORDER BY id`
    );
   
    return result.rows;
  } catch (err) {
    res.status(500).json({ message: 'Error creating product', error: err.message });
  }
};

