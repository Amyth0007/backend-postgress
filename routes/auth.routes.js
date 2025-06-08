import express from 'express';
import { loginController, createUserController, fetchUsers, getMapApiKey } from '../controllers/user.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/login', loginController);
router.post('/signup', createUserController);
router.get('/fetch', fetchUsers);
router.get('/config', auth,getMapApiKey )

export default router;
