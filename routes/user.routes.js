import express from 'express';
import { createIntentsController, getMessIntentsController, getUserIntentController } from '../controllers/intents.controller.js';
import { createMess, getMessDetail, getMessLocation, isMessExist } from '../controllers/mess-config.controller.js';
import { testing } from '../controllers/prodcut.controller.js';
import { fetchUsers } from '../controllers/user.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/user', auth, fetchUsers);
router.get('/messlocation',auth, getMessLocation);
router.post('/mess/create', createMess);
router.get('/mess/mess-details', auth, getMessDetail);
router.get('/mess/exist', isMessExist);
router.post('/save-intent',auth, createIntentsController);
router.get('/get-intent',auth, getUserIntentController);
router.get('/get-mess-intents',auth, getMessIntentsController);
router.get('/test',  testing);


export default router;
