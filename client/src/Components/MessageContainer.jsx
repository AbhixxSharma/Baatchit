import { useEffect, useState, useContext, useRef } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import MessageInput from "./MessageInput";

function MessageContainer({ selectedConversation }) {
  const { user } = useContext(AuthContext);
  const { socket } = useSocket();

  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState("");

  const typingTimeout = useRef(null);

  // Fetch Messages
  const getMessages = async () => {
    if (!selectedConversation) return;

    try {
      const response = await API.get(
        `/messages/${selectedConversation._id}`
      );

      setMessages(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Load messages whenever conversation changes
  useEffect(() => {
    getMessages();
  }, [selectedConversation]);

  // Listen for realtime messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      console.log("Realtime Message:", newMessage);

      if (
        String(newMessage.conversationId) !==
        String(selectedConversation?._id)
      ) {
        return;
      }

      setMessages((prev) => {
        const exists = prev.some(
          (msg) => String(msg._id) === String(newMessage._id)
        );

        if (exists) return prev;

        return [...prev, newMessage];
      });
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedConversation]);

  // Typing Indicator
  useEffect(() => {
    if (!socket) return;

    const handleTyping = ({ senderName }) => {
      setTyping(`${senderName} is typing...`);

      clearTimeout(typingTimeout.current);

      typingTimeout.current = setTimeout(() => {
        setTyping("");
      }, 1500);
    };

    socket.on("typing", handleTyping);

    return () => {
      socket.off("typing", handleTyping);
      clearTimeout(typingTimeout.current);
    };
  }, [socket]);

  if (!selectedConversation) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <h1 className="text-2xl text-gray-500">
          Welcome to BaatChit 👋
        </h1>
      </div>
    );
  }

  const otherUser = selectedConversation.participants.find(
    (participant) =>
      String(participant._id) !== String(user?._id)
  );

  return (
    <div className="flex-1 flex flex-col">

      {/* Header */}
      <div className="border-b p-4 shadow-sm">
        <h2 className="text-xl font-semibold">
          {otherUser?.name}
        </h2>

        {typing && (
          <p className="text-sm text-green-600 mt-1 animate-pulse">
            {typing}
          </p>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500">
            No messages yet.
          </p>
        ) : (
          messages.map((message) => {
            const isMe =
              String(message.senderId._id) ===
              String(user?._id);

            return (
              <div
                key={message._id}
                className={`mb-3 flex ${
                  isMe
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-lg max-w-xs ${
                    isMe
                      ? "bg-blue-500 text-white"
                      : "bg-white"
                  }`}
                >
                  {message.message}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <MessageInput
        selectedConversation={selectedConversation}
        messages={messages}
        setMessages={setMessages}
      />
    </div>
  );
}

export default MessageContainer;