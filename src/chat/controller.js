const { ChatData } = require('./model');
const mongoose = require("mongoose");

const addNewChat = async(req, res) => {
        const Chat = new ChatData(req.body);
        await Chat.save().then(response => {
            return res.status(200).send({success: true, message: 'Data saved.'})
        }).catch(error => {
            return res.status(500).send({success: false, message: '', error: error})
        })
}

const ChatList = async(req, res) => {
    await ChatData.find({from_user: req.params.fid, to_user: req.params.tid, status: "ACTIVE"})
    .then(response => {
        if(response.length > 0) {
            response[0].messages.reverse();
        }
        return res.status(201).send({success: true, message: '', data: response});
    }).catch(error => {
        return res.status(500).send({success: false, message: error.message});
    })
}

const updateChat = async(_id, message) => {
    await ChatData.findByIdAndUpdate({_id: _id}, {$push: {messages: message}})
    .then(response => {
        console.log("updated")
    }).catch(error => {
        console.log("not updated: ", error.message)
    })
}

module.exports = {
    ChatList,
    addNewChat,
    updateChat
}