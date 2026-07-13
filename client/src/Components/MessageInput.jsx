import { useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

function MessageInput({
  selectedConversation,
  messages,
  setMessages,
}) {
  const [message, setMessage] = useState("");

  const { user } = useContext(AuthContext);

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

      console.log(response.data);

      
      setMessages((prev) => [...prev, response.data]);

      
      setMessage("");

    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to send message");
    }
  };

  return (
    <div className="p-4 border-t flex gap-2 bg-white">

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
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