import express from 'express';
import { loginController, createUserController, fetchUsers } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/login', loginController);
router.post('/signup', createUserController);
router.get('/fetch', fetchUsers);

export default router;
