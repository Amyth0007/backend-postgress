import express from 'express';
import auth from '../middleware/auth.js';
import { addThaliController, updateThaliController, deleteThaliController, getThalisController, publishThaliController } from '../controllers/thalis.controller.js';
const router = express.Router();

router.post('/add', auth, addThaliController);
router.put('/update/:id', auth, updateThaliController);
router.delete('/delete/:id', auth, deleteThaliController);
router.get('/get', auth, getThalisController);
router.patch('/publish/:id', auth, publishThaliController);

export default router;