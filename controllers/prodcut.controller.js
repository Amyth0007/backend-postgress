import { getProduct, saveProduct } from '../services/product.service.js';

export const createProduct = async (req, res) => {
  try {
    await saveProduct(req.body);
    res.status(201).json({ message: 'History saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error saving history', details: err.message });
  }
};


export const testing = async (req, res) => {
  try {
    res.status(201).json({ message: 'Project is live' });
  } catch (err) {
    res.status(500).json({ error: 'Error saving history', details: err.message });
  }
};

export const fetchProducts = async (req, res) => {
  try {
    const history = await getProduct();
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching history', details: err.message });
  }
};
