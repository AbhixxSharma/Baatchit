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
  <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-50">

    {/* ================= HEADER ================= */}

    <div className="h-20 px-6 flex items-center justify-between backdrop-blur-xl bg-white/70 border-b border-white/40 shadow-md">

      <div className="flex items-center gap-4">

        <div className="relative">

          <img
            src={
              otherUser?.profile_picture ||
              `https://ui-avatars.com/api/?background=10b981&color=fff&name=${otherUser?.name}`
            }
            alt=""
            className="w-14 h-14 rounded-full object-cover ring-4 ring-emerald-100 shadow-lg"
          />

          <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white animate-pulse"></span>

        </div>

        <div>

          <h2 className="font-bold text-2xl text-slate-800">
            {otherUser?.name}
          </h2>

          {typing ? (
            <p className="text-green-600 text-sm animate-pulse">
              {typing}
            </p>
          ) : (
            <p className="text-slate-500 text-sm">
              {/* 🟢 Active Now */}
            </p>
          )}

        </div>

      </div>

    </div>

    {/* ================= CHAT ================= */}

    <div
      className="
      flex-1
      overflow-y-auto
      scroll-smooth
      px-8
      py-8
      space-y-5
      bg-gradient-to-br
      from-[#eef2ff]
      via-[#f8fafc]
      to-[#ecfeff]
      "
      style={{
        backgroundImage:
          "url('https://www.transparenttextures.com/patterns/cubes.png')",
      }}
    >

      {messages.length === 0 ? (

        <div className="h-full flex items-center justify-center">

          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-10">

            <h1 className="text-4xl font-bold text-slate-600">
              👋 Start chatting
            </h1>

            <p className="text-slate-400 mt-2 text-center">
              Send your first message
            </p>

          </div>

        </div>

      ) : (

        messages.map((message) => {

          const isMe =
            String(message.senderId._id) ===
            String(user?._id);

          return (

            <div
              key={message._id}
              className={`flex ${
                isMe
                  ? "justify-end"
                  : "justify-start"
              }`}
            >

              <div
                className={`group
                max-w-md
                transition-all
                duration-300
                hover:scale-[1.02]
                hover:-translate-y-1
                ${
                  isMe
                    ? "bg-gradient-to-r from-emerald-400 to-teal-500 text-white rounded-[24px] rounded-br-md shadow-xl"
                    : "bg-white/80 backdrop-blur-md text-slate-700 rounded-[24px] rounded-bl-md shadow-lg border border-white/60"
                }
                px-4
                py-3`}
              >

                {/* TEXT */}

                {message.message && (

                  <p className="leading-7 break-words">
                    {message.message}
                  </p>

                )}

                {/* IMAGE */}

                {message.mediaType === "image" && (

                  <img
                    src={message.media}
                    alt=""
                    className="
                    mt-3
                    rounded-2xl
                    max-w-[300px]
                    object-cover
                    cursor-pointer
                    transition-all
                    duration-300
                    hover:scale-105
                    hover:shadow-2xl
                    "
                  />

                )}

                {/* VIDEO */}

                {message.mediaType === "video" && (

                  <video
                    controls
                    className="
                    mt-3
                    rounded-2xl
                    max-w-[300px]
                    shadow-xl
                    "
                  >
                    <source
                      src={message.media}
                      type="video/mp4"
                    />
                  </video>

                )}

                {/* TIME */}

                <div
                  className={`mt-2 text-[11px] ${
                    isMe
                      ? "text-emerald-100"
                      : "text-slate-400"
                  } text-right`}
                >
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>

              </div>

            </div>

          );
        })

      )}

    </div>

    {/* ================= INPUT ================= */}

    <MessageInput
      selectedConversation={selectedConversation}
      setMessages={setMessages}
    />

  </div>
);
}

export default MessageContainer;