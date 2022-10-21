import express from 'express';
import {
      authenticateUser,
    //   getUserDetails,
    registerUser,
    searchUser,
    //   updateUser,
} from '../controllers/userController.js';
import protect from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/auth', upload.single('image'), registerUser);
router.post('/auth/login', authenticateUser);
router.get('/search', protect, searchUser)
// router.get('/:id', protect, getUserDetails);
// router.put('/', protect, updateUser);

export default router;
