import express from 'express';
import {
    createMessageGroup,
    addUserInMessageGroup,
    removeUserFromMessageGroup,
    addUserAdminPrivilege,
    removeUserAdminPrivilege,
    deleteMessageGroup,
    getMessageGroupDetails,
    getUsersMessageGroups,
    updateMessageGroupName,
    updateMessageGroupImage,
    getMessageGroupMessages,
    markMessageAsRead
} from '../controllers/messageController.js';
import protect from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/group', protect, upload.single('groupImage'), createMessageGroup);
router.get('/group/:id', protect, getMessageGroupDetails);
router.get('/group/by-user/:userId', protect, getUsersMessageGroups);
router.put('/group', protect, updateMessageGroupName);
router.delete('/group/:id', protect, deleteMessageGroup);
router.put('/group/image', protect, upload.single('groupImage'), updateMessageGroupImage)
router.put('/group/add-user', protect, addUserInMessageGroup);
router.put('/group/remove-user', protect, removeUserFromMessageGroup);
router.put('/group/make-admin', protect, addUserAdminPrivilege);
router.put('/group/undo-admin', protect, removeUserAdminPrivilege);
router.get('/group/messages/:groupId', protect, getMessageGroupMessages)
router.post('/mark-read', protect, markMessageAsRead)

export default router;