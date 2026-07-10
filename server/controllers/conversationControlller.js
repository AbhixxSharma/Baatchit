import Conversation from "../models/conversation.js";

const createConversation= async(req,res)=>{
    // 1 receiver from req.body
    const{ receiverId }= req.body;

    const senderId=req.user._id
    const conversation= await Conversation.findOne({
        participants:{
            $all:[senderId,receiverId]
        }
    })
    if(conversation){
        return res.status(200).json(conversation)
    }
    // else...

    const newConversation= await Conversation.create({
           participants: [senderId, receiverId]
        })

        return res.status(201).json(newConversation)



}


const getUserConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      participants: userId,
    }).populate("participants", "name email photoURL")
    .sort({ updatedAt: -1 });

    return res.status(200).json(conversations);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export {createConversation,
    getUserConversations
}