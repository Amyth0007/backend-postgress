import { createUser, getUser, loginUser } from '../services/user.service.js';
import { errorResponse, successResponse } from '../utils/response.util.js';

export const createUserController = async (req, res) => {
    try {
        const user = await createUser(req.body);
        return successResponse(res, 'User created successfully', user);
    } catch (err) {
        return errorResponse(res, err.message);
    }
};
export const loginController = async (req, res) => {
    try {
        const user = await loginUser(req.body);
        return successResponse(res, 'User created successfully', user);
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

export const fetchUsers = async (req, res) => {
  try {
    const history = await getUser(req.userId);
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching history', details: err.message });
  }
};
export const getMapApiKey = async (req, res) => {
  try {
    const api_url = 'AIzaSyA1TTUD5luKbZoBrDRdEOI-qEeF1ZL5XzI'
    res.status(200).json({googleMapsApiKey: api_url});
  } catch (err) {
    res.status(500).json({ error: 'Error fetching history', details: err.message });
  }
};

