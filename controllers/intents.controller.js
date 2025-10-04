import { createIntents, getIntentsByMessId, getIntentsByUserId } from '../services/intents.service.js';
import { getMessIdByUserId } from '../services/thalis.service.js';

export const createIntentsController = async (req, res) => {
  try {
    const orderData = req;
    const result = await createIntents(orderData);

    res.status(201).json({
      message: 'Order created successfully',
      orderId: result.orderId,
      success: true
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};


export const getUserIntentController = async (req, res) => {
  try {
    const { userid } = req.query;

    if (!userid) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const orders = await getIntentsByUserId(userid);

    res.status(200).json({
      message: 'Intents fetched successfully',
      data: orders
    });
  } catch (error) {
    console.error('Error fetching Intents:', error);
    res.status(500).json({ message: 'Error fetching Intents', error: error.message });
  }
};

export const getMessIntentsController = async (req, res) => {
  try {
    const userid = req.userId;
    const messId = await getMessIdByUserId(userid);

    if (!messId) {
      return res.status(400).json({ message: 'Mess ID is required' });
    }

    const intents = await getIntentsByMessId(messId);

    res.status(200).json({
      message: 'Mess intents fetched successfully',
      data: intents
    });
  } catch (error) {
    console.error('Error fetching mess intents:', error);
    res.status(500).json({ message: 'Error fetching mess intents', error: error.message });
  }
};




