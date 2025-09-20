import express from 'express';
import auth from '../middleware/auth.js';
import { addThaliController, updateThaliController, deleteThaliController, getThalisController, publishThaliController, getMessSpecificThalis } from '../controllers/thalis.controller.js';
const router = express.Router();

router.post('/add', auth, addThaliController);
router.put('/update/:id', auth, updateThaliController);
router.delete('/delete/:id', auth, deleteThaliController);
router.get('/get', auth, getThalisController);
router.get('/get-mess-specific-thalis', auth, getMessSpecificThalis )
router.patch('/publish/:id', auth, publishThaliController);

export default router;