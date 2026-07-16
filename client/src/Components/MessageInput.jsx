import { useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";

function MessageInput({
  selectedConversation,
  setMessages,
}) {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const { user } = useContext(AuthContext);
  const { socket } = useSocket();

  const receiver = selectedConversation?.participants.find(
    (participant) => participant._id !== user?._id
  );

  const sendMessage = async () => {
    if (!message.trim() && !selectedFile) return;

    try {
      const formData = new FormData();

      formData.append(
        "conversationId",
        selectedConversation._id
      );

      formData.append(
        "receiverId",
        receiver._id
      );

      if (message.trim()) {
        formData.append("message", message);
      }

      if (selectedFile) {
        formData.append("media", selectedFile);
      }

      const response = await API.post(
        "/messages",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessages((prev) => {
        const exists = prev.some(
          (msg) => String(msg._id) === String(response.data._id)
        );

        if (exists) return prev;

        return [...prev, response.data];
      });

      setMessage("");
      setSelectedFile(null);

    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message ||
          "Failed to send message"
      );
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
    <div className="border-t bg-white p-4">

      {/* Selected File */}

      {selectedFile && (

        <div className="mb-3 flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">

          <div className="flex items-center gap-3">

            <span className="text-2xl">📎</span>

            <div>

              <p className="font-medium text-slate-700">
                {selectedFile.name}
              </p>

              <p className="text-xs text-slate-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>

            </div>

          </div>

          <button
            onClick={() => setSelectedFile(null)}
            className="
            w-8
            h-8
            rounded-full
            bg-red-100
            text-red-600
            hover:bg-red-500
            hover:text-white
            transition-all
            duration-300
            "
          >
            ✕
          </button>

        </div>

      )}

      <div className="flex items-center gap-3">

        {/* Upload */}

        <input
          id="media"
          type="file"
          hidden
          accept="image/*,video/*"
          onChange={(e) =>
            setSelectedFile(e.target.files[0])
          }
        />

        <label
          htmlFor="media"
          className="
          w-12
          h-12
          rounded-full
          bg-slate-100
          flex
          items-center
          justify-center
          cursor-pointer
          text-2xl
          transition-all
          duration-300
          hover:bg-emerald-500
          hover:text-white
          hover:scale-110
          shadow-sm
          "
        >
          📎
        </label>

        {/* Input */}

        <input
          type="text"
          value={message}
          onChange={handleTyping}
          placeholder="Type your message..."
          className="
          flex-1
          h-12
          rounded-full
          bg-slate-100
          px-6
          outline-none
          transition-all
          duration-300
          border
          border-transparent
          focus:bg-white
          focus:border-emerald-400
          focus:ring-4
          focus:ring-emerald-100
          "
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />

        {/* Send */}

        <button
          onClick={sendMessage}
          className="
          w-12
          h-12
          rounded-full
          bg-gradient-to-r
          from-emerald-500
          to-green-600
          text-white
          text-xl
          flex
          items-center
          justify-center
          shadow-lg
          transition-all
          duration-300
          hover:scale-110
          hover:rotate-12
          hover:shadow-emerald-300
          active:scale-95
          "
        >
          ➤
        </button>

      </div>

    </div>
  );
}

export default MessageInput;