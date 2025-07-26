


export const testing = async (req, res) => {
  try {
    res.status(201).json({ message: 'Project is live' });
  } catch (err) {
    res.status(500).json({ error: 'Error saving history', details: err.message });
  }
};

