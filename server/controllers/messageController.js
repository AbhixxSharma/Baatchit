import Message from "../models/message.js";
import Conversation from "../models/conversation.js";
const sendMessages= async(req,res)=>{
    try{
    const {conversationId,message} = req.body;
    const senderId= req.user._id;
    const newMessage= await Message.create({
        conversationId,
        senderId,
        message,
    })
    await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: message,
        });
    
     return res.status(201).json(newMessage);

    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
const getMessage= async(req,res)=>{
    try{
    const{ conversationId}= req.params
    const message= await Message.find({
        conversationId: conversationId
    }).populate("senderId", "name photoURL").sort({createdAt: 1})
    return res.status(200).json(messages);
}catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

export { sendMessages ,getMessages};

