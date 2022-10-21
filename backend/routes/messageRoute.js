import express from 'express';
import {
    createMessageGroup,
    addUserInMessageGroup,
    removeUserFromMessageGroup,
    addUserAdminPrivilege,
    removeUserAdminPrivilege,
    deleteMessageGroup
} from '../controllers/messageController.js';
import protect from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/group', protect, createMessageGroup);
router.delete('/group/:id', protect, deleteMessageGroup);
router.put('/group/add-user', protect, addUserInMessageGroup);
router.put('/group/remove-user', protect, removeUserFromMessageGroup);
router.put('/group/make-admin', protect, addUserAdminPrivilege);
router.put('/group/undo-admin', protect, removeUserAdminPrivilege);

export default router;