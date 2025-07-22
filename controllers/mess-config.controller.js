import { getMessaLocation, isMessExistForUser, saveMess } from '../services/messConfig.service.js';


export const getMessLocation = async (req, res) => {
  try {
    const data = await getMessaLocation();
    res.status(201).json({ data: data});
  } catch (err) {
    res.status(500).json({ error: 'Error saving history', details: err.message });
  }
};

export const createMess = async (req, res)=>{
  try {
    await saveMess(req.body);
    res.status(201).json({ message: 'Mess created successfully' });
  } catch (error) {
    
  }
}

export const isMessExist = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    const exists = await isMessExistForUser(userId);
    res.status(200).json({ exists });
  } catch (error) {
    console.error('Error checking mess existence:', error);
    res.status(500).json({ message: 'Error checking mess existence', error: error.message });
  }
}

