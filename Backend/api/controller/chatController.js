const Chat = require('../models/chat');

// create new chat
const createChat = async (req, res) => {
    const newChat = new Chat({
        members: [req.body.senderId, req.body.receiverId],
    })
    try{
        const result = await newChat.save();
        res.status(200).json(result);
    }catch(error){
        res.status(500).json(error);
    }
};

// get chat by id
const getChatById = async (req, res) => {
    try{
        const chat = await Chat.find({
            members: {$in: [req.params.id]}
        })
        res.status(200).json(chat);
    }catch(error){
        res.status(500).json(error);
    }
};

// get chat of 2 members
const getChat = async (req, res) => {
    try{
        const chat = await Chat.findOne({
            members: {$all: [req.params.fid, req.params.sid]}
        })
        res.status(200).json(chat);
    }catch(error){
        res.status(500).json(error);
    }
};

module.exports = {
    createChat,
    getChatById,
    getChat
 };
