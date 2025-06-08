import { getMessaLocation } from '../services/messLocation.service.js';


export const getMessLocation = async (req, res) => {
  try {
    const data = await getMessaLocation();
    res.status(201).json({ data: data});
  } catch (err) {
    res.status(500).json({ error: 'Error saving history', details: err.message });
  }
};

