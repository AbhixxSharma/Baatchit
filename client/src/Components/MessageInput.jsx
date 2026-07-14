import { useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";

function MessageInput({
  selectedConversation,
  setMessages,
}) {
  const [message, setMessage] = useState("");

  const { user } = useContext(AuthContext);
  const { socket } = useSocket();

  const receiver = selectedConversation?.participants.find(
    (participant) => participant._id !== user?._id
  );

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      const response = await API.post("/messages", {
        conversationId: selectedConversation._id,
        receiverId: receiver._id,
        message,
      });

      // ✅ Add message immediately for sender
      setMessages((prev) => {
        const exists = prev.some(
          (msg) => String(msg._id) === String(response.data._id)
        );

        if (exists) return prev;

        return [...prev, response.data];
      });

      setMessage("");

    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to send message");
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);

    if (!receiver) return;

    socket?.emit("typing", {
      receiverId: receiver._id,
      senderName: user.name,
    });
  };

  return (
    <div className="p-4 border-t flex gap-2 bg-white">

      <input
        type="text"
        value={message}
        onChange={handleTyping}
        placeholder="Type a message..."
        className="flex-1 border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage();
          }
        }}
      />

      <button
        onClick={sendMessage}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        Send
      </button>

    </div>
  );
}

export default MessageInput;