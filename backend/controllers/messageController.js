import asyncHandler from 'express-async-handler';
import ChatGroup from "../models/chatGroupModel.js";
import User from "../models/userModel.js";
import mongoose from 'mongoose';
import ChatMessage from '../models/chatMessageModel.js';

const createMessageGroup = asyncHandler(async (req, res) => {
    const { groupName, isMultiUserGroup, groupImage, users } = req.body;
    const groupUsers = [];

    //It is to validate that all users being added in group is valid and activated.
    for await (const userId of users) {
        let user = await User.findOne({ _id: userId, isActive: true }).select({ _id: 1 });
        if (user) {
            groupUsers.push(mongoose.Types.ObjectId(user.id));
        }
    }

    if (groupUsers.length < 2) {
        throw new Error('There must be atleast 2 users in a group');
    }

    //To check if already a group exists with all specified users in case of MultiUserGroup
    let group = await ChatGroup.findOne({
        $and: [
            { "users.userId": { $all: groupUsers } },
            { users: { $size: groupUsers.length } }
        ]
    })

    if (group) {
        res.status(200).json(group)
        return
    }

    const imageUrl = '';
    if (req.file) {
        const image = req.file.path;
        imageUrl = await uploadFile(image, "message-group-image");
    }

    const data = {
        groupName: groupName ? groupName : null,
        isMultiUserGroup: isMultiUserGroup ? isMultiUserGroup : false,
        groupImageUrl: imageUrl,
        users: groupUsers.map(u => {
            return {
                userId: u,
                isAdmin: u == req.user.id,
            }
        })
    }

    let messageGroup = await ChatGroup.create(data);
    res.status(201).json(messageGroup);
})

const addUserInMessageGroup = asyncHandler(async (req, res) => {
    const { groupId, userId } = req.body;

    const group = await ChatGroup.findById(groupId);
    if (!group) {
        throw new Error("MessageGroup with given id not found")
    }
    if (!group.isMultiUserGroup) {
        throw new Error("Users can't be added in this group")
    }

    const currentUser = group.users.find(e => e.userId == req.user.id)
    if (!currentUser || !currentUser?.isAdmin) {
        throw new Error("You don't have permission to perform this task")
    }

    let user = await User.findOne({ _id: userId, isActive: true }).select({ _id: 1 });
    if (!user) {
        throw new Error("User with given id not found")
    }
    const exits = group.users.find(u => u.id == userId)
    if (exits) {
        throw new Error("User already exist in the group")
    }

    const updatedGroup = await ChatGroup.findByIdAndUpdate(groupId,
        {
            $push: {
                users: {
                    userId: mongoose.Types.ObjectId(user.id),
                    isAdmin: false
                }
            }
        },
        { new: true }
    )
    res.status(200).json(updatedGroup);
})

const removeUserFromMessageGroup = asyncHandler(async (req, res) => {
    const { groupId, userId } = req.body;

    const group = await ChatGroup.findById(groupId);
    if (!group) {
        throw new Error("MessageGroup with given id not found")
    }
    const currentUser = group.users.find(e => e.userId == req.user.id)
    if (!currentUser || !currentUser?.isAdmin || currentUser.id != req.user.id) {
        throw new Error("You don't have permission to perform this task")
    }

    let user = await User.findOne({ _id: userId, isActive: true }).select({ _id: 1 });
    if (!user) {
        throw new Error("User with given id not found")
    }

    const updatedGroup = await ChatGroup.findByIdAndUpdate(groupId,
        {
            $pull: {
                users: { userId: mongoose.Types.ObjectId(user.id) }
            }
        },
        { new: true }
    )
    res.status(200).json(updatedGroup);
})

const addUserAdminPrivilege = asyncHandler(async (req, res) => {
    const { groupId, userId } = req.body;
    const group = await ChatGroup.findById(groupId);
    if (!group) {
        throw new Error("MessageGroup with given id not found")
    }

    const currentUser = group.users.find(e => e.userId == req.user.id)
    if (!currentUser || !currentUser?.isAdmin) {
        throw new Error("You don't have permission to perform this task")
    }

    const updatedGroup = await ChatGroup.findOneAndUpdate(
        {
            _id: groupId,
            "users.userId": userId
        },
        { $set: { "users.$.isAdmin": true } },
        { new: true }
    );
    res.status(200).json(updatedGroup);
})

const removeUserAdminPrivilege = asyncHandler(async (req, res) => {
    const { groupId, userId } = req.body;
    const group = await ChatGroup.findById(groupId);
    if (!group) {
        throw new Error("MessageGroup with given id not found")
    }

    const currentUser = group.users.find(e => e.userId == req.user.id)
    if (!currentUser || !currentUser?.isAdmin) {
        throw new Error("You don't have permission to perform this task")
    }

    const updatedGroup = await ChatGroup.findOneAndUpdate(
        {
            _id: groupId,
            "users.userId": userId
        },
        { $set: { "users.$.isAdmin": false } },
        { new: true }
    );
    res.status(200).json(updatedGroup);
})

const deleteMessageGroup = asyncHandler(async (req, res) => {
    const groupId = req.params.id;
    const group = await ChatGroup.findById(groupId);
    if (!group) {
        throw new Error("MessageGroup with given id not found")
    }

    const currentUser = group.users.find(e => e.userId == req.user.id)
    if (!currentUser || !currentUser?.isAdmin) {
        throw new Error("You don't have permission to perform this task")
    }
    await ChatGroup.deleteOne({ _id: groupId });
    res.status(200).send("Message group deleted successfully");
})

const getMessageGroupDetails = asyncHandler(async (req, res) => {
    const groupId = req.params.id;

    const group = await ChatGroup.findById(groupId);
    res.status(200).json(group);
})

const getUsersMessageGroups = asyncHandler(async (req, res) => {
    const userId = req.params.userId;

    let user = await User.findOne({ _id: userId, isActive: true }).select({ _id: 1 });
    if (!user) {
        throw new Error("User with given id not found")
    }

    // const groups = await ChatGroup.find({ "users.userId": userId });
    const groups = await ChatGroup.aggregate([
        {
            $match: {
                users: {
                    $elemMatch: {
                        //The $elemMatch operator matches documents that contain an array field with at least 
                        //one element that matches all the specified query criteria.
                        userId: mongoose.Types.ObjectId(userId)
                    }
                }
            }
        },
        {
            $lookup: {
                from: 'chatmessages',
                localField: '_id',
                foreignField: 'groupId',
                as: 'lastMessage'
            }
        },
        {$unwind: '$lastMessage'},
        {
            $group: {
                _id: "$_id",
                groupName: { $first: '$groupName' },
                isMultiUserGroup: { $first: '$isMultiUserGroup' },
                groupImageUrl: { $first: '$groupImageUrl' },
                users: {$first: "$users"},
                lastMessage: {$max: "$lastMessage"}
            }
        },
        { $unwind: '$users' },
        {
            $lookup: {
                from: 'users',
                // localField: 'users.userId',
                // foreignField: '_id',
                let: { userId: '$users.userId' },
                pipeline: [
                    {
                        '$match': {
                            '$expr':
                            {
                                '$eq': ['$_id', '$$userId']
                            }
                        }
                    },
                    {
                        '$project': {
                            '_id': 0,
                            'name': 1,
                            'imageUrl': 1
                        }
                    }
                ],
                as: 'users.info'
            }
        },
        { $unwind: '$users.info' },
        {
            $group: {
                _id: "$_id",
                groupName: { $first: '$groupName' },
                isMultiUserGroup: { $first: '$isMultiUserGroup' },
                groupImageUrl: { $first: '$groupImageUrl' },
                users: { $push: "$users" },
                lastMessage: {$first: "$lastMessage"}
            }
        },
    ])
    res.status(200).json(groups);
})

const updateMessageGroupName = asyncHandler(async (req, res) => {
    const { newGroupName, groupId } = req.body;

    const updatedGroup = await ChatGroup.findOneAndUpdate({ _id: groupId }, { $set: { groupName: newGroupName } }, { new: 1 });
    res.status(200).json(updatedGroup);
})

const updateMessageGroupImage = asyncHandler(async (req, res) => {
    const { groupId } = req.body;
    const imageUrl = '';
    if (req.file) {
        const image = req.file.path;
        imageUrl = await uploadFile(image, "message-group-image");
    } else {
        throw new Error("Upload some image to update your group image.")
    }
    const updatedGroup = await ChatGroup.findOneAndUpdate({ _id: groupId }, { $set: { groupImageUrl: imageUrl } }, { new: true })
})

const getMessageGroupMessages = asyncHandler(async (req, res) => {
    const groupId = req.params.groupId;
    const groupMessages = await ChatMessage.find({ groupId: groupId });
    res.status(200).json(groupMessages);
})

export {
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
    getMessageGroupMessages
}
