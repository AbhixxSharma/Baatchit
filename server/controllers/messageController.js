import Message from "../models/message.js";
import Conversation from "../models/conversation.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { io, getReceiverSocketId } from "../socket.js";

// =========================
// Send Message
// =========================
const sendMessages = async (req, res) => {
  try {
    const { conversationId, message } = req.body;
    const senderId = req.user._id;

    let media = "";
    let mediaType = "";

    // Upload Image/Video
    if (req.file) {
      const uploadedFile = await uploadOnCloudinary(req.file.path);

      if (!uploadedFile) {
        return res.status(400).json({
          message: "Media upload failed",
        });
      }

      media = uploadedFile.secure_url;
      mediaType = uploadedFile.resource_type; // image or video
    }

    // Create Message
    const newMessage = await Message.create({
      conversationId,
      senderId,
      message: message || "",
      media,
      mediaType,
    });

    // Update Conversation
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage:
        message ||
        (mediaType === "image"
          ? "📷 Image"
          : mediaType === "video"
          ? "Video"
          : ""),
    });

    // Populate Sender
    const populatedMessage = await Message.findById(newMessage._id)
      .populate("senderId", "name");

    // Find Receiver
    const conversation = await Conversation.findById(conversationId);

    const receiverId = conversation.participants.find(
      (id) => id.toString() !== senderId.toString()
    );

    // Send realtime message
    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit(
        "newMessage",
        populatedMessage
      );
    }

    // Return to sender
    return res.status(201).json(populatedMessage);

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// =========================
// Get Messages
// =========================
const getMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({
      conversationId,
    })
      .populate("senderId", "name")
      .sort({ createdAt: 1 });

    return res.status(200).json(messages);

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export {
  sendMessages,
  getMessage,
};