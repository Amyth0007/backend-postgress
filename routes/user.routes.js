import express from 'express';
import {  createProduct, fetchProducts, testing} from '../controllers/prodcut.controller.js';
import auth from '../middleware/auth.js';
import { fetchUsers } from '../controllers/user.controller.js';
import { getMessLocation } from '../controllers/messlocation.controller.js';

const router = express.Router();

router.get('/fetch', auth, fetchProducts);
router.get('/user', auth, fetchUsers);
router.get('/messlocation',auth, getMessLocation);
router.post('/save', createProduct);
router.get('/test',  testing);

export default router;
