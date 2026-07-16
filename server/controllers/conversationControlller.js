import Conversation from "../models/conversation.js";

// Create Conversation
const createConversation = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user._id;

   
    let conversation = await Conversation.findOne({
      participants: {
        $all: [senderId, receiverId],
      },
    }).populate("participants", "name email profile_picture");

    if (conversation) {
      return res.status(200).json(conversation);
    }

   
    const newConversation = await Conversation.create({
      participants: [senderId, receiverId],
    });

    
    conversation = await Conversation.findById(newConversation._id)
      .populate("participants", "name email profile_picture");

    return res.status(201).json(conversation);

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};


const getUserConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "name email profile_picture")
      .sort({ updatedAt: -1 });

    return res.status(200).json(conversations);

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export {
  createConversation,
  getUserConversations,
};
// const getUserConversations = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     console.log("Logged In User:", userId);

//     const conversations = await Conversation.find({
//       participants: userId,
//     })
//       .populate("participants", "name email photoURL")
//       .sort({ updatedAt: -1 });

//     console.log("Conversations:", conversations);

//     return res.status(200).json(conversations);
//   } catch (error) {
//     return res.status(500).json({
//       message: error.message,
//     });
//   }
// };
