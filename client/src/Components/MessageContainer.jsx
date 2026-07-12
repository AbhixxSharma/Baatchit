import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import MessageInput from "./MessageInput";

function MessageContainer({ selectedConversation }) {
  const { user } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);

  // Fetch Messages
  const getMessages = async () => {
    if (!selectedConversation) return;

    try {
      const response = await API.get(
        `/messages/${selectedConversation._id}`
      );

      console.log(response.data);

      setMessages(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMessages();
  }, [selectedConversation]);

  // No conversation selected
  if (!selectedConversation) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <h1 className="text-2xl text-gray-500">
          Welcome to BaatChit 👋
        </h1>
      </div>
    );
  }

  // Find the other user
  const otherUser = selectedConversation.participants.find(
    (participant) => participant._id !== user?._id
  );

  return (
  <div className="flex-1 flex flex-col">

    {/* Header */}
    <div className="border-b p-4 shadow-sm">
      <h2 className="text-xl font-semibold">
        {otherUser?.name}
      </h2>
    </div>

    {/* Messages */}
    <div className="flex-1 overflow-y-auto p-4 bg-gray-100">

      {messages.length === 0 ? (
        <p className="text-center text-gray-500">
          No messages yet.
        </p>
      ) : (
        messages.map((message) => (
          <div
            key={message._id}
            className={`mb-3 flex ${
              message.senderId._id === user?._id
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-xs ${
                message.senderId._id === user?._id
                  ? "bg-blue-500 text-white"
                  : "bg-white"
              }`}
            >
              {message.message}
            </div>
          </div>
        ))
      )}

    </div>

    {/* Message Input */}
    <MessageInput
      selectedConversation={selectedConversation}
      messages={messages}
      setMessages={setMessages}
    />

  </div>
);
}

export default MessageContainer;