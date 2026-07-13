import Message from "../models/message.js";
import Conversation from "../models/conversation.js";

// ⭐ Add this
import { io, getReceiverSocketId } from "../socket.js";
const sendMessages = async (req, res) => {
  try {
    const { conversationId, message } = req.body;
    const senderId = req.user._id;

    const newMessage = await Message.create({
      conversationId,
      senderId,
      message,
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message,
    });

    // ⭐ Get Conversation
    const conversation = await Conversation.findById(conversationId);

    // ⭐ Find Receiver
    const receiverId = conversation.participants.find(
      (id) => id.toString() !== senderId.toString()
    );

    // ⭐ Get Receiver Socket
    const receiverSocketId = getReceiverSocketId(receiverId);

    // ⭐ Populate sender details
    const populatedMessage = await Message.findById(newMessage._id)
      .populate("senderId", "name photoURL");

    // ⭐ Send realtime message
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", populatedMessage);
    }

    return res.status(201).json(populatedMessage);

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
    return res.status(200).json(message);
}catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

export { sendMessages ,getMessage};

