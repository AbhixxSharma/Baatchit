import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSocket } from "../context/SocketContext";

import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import UserList from "./UserList";

function Sidebar({
  selectedConversation,
  setSelectedConversation,
}) {
  const { user, setUser } = useContext(AuthContext);
  const { onlineUsers } = useSocket();

  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [showUserList, setShowUserList] = useState(false);

  const getConversations = async () => {
    try {
      const response = await API.get("/conversations");
      setConversations(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await API.post("/auth/logout");

      setUser(null);

      toast.success(response.data.message);

      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Logout Failed"
      );
    }
  };

  useEffect(() => {
    getConversations();
  }, []);

  return (
    <div className="w-80 h-screen border-r bg-white flex flex-col">

      {/* Current User */}
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">{user?.name}</h2>
        <p className="text-sm text-gray-500">{user?.email}</p>
      </div>

      {/* New Chat */}
      <div className="p-4 border-b">
        <button
          onClick={() => setShowUserList(true)}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          + New Chat
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b">
        <input
          type="text"
          placeholder="Search..."
          className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <p className="text-center text-gray-500 mt-5">
            No Conversations Found
          </p>
        ) : (
          conversations.map((conversation) => {

            const otherUser = conversation.participants.find(
              (participant) =>
                String(participant._id) !== String(user?._id)
            );

            if (!otherUser) return null;

            const isOnline = onlineUsers.some(
              (id) => String(id) === String(otherUser._id)
            );

            console.log({
              otherUserId: otherUser._id,
              onlineUsers,
              isOnline,
            });

            return (
              <div
                key={conversation._id}
                onClick={() => setSelectedConversation(conversation)}
                className={`flex items-center gap-3 p-4 border-b cursor-pointer hover:bg-gray-100 transition ${
                  selectedConversation?._id === conversation._id
                    ? "bg-blue-100"
                    : ""
                }`}
              >
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={
                      otherUser.profile_picture ||
                      `https://ui-avatars.com/api/?name=${otherUser.name}`
                    }
                    alt={otherUser.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  {isOnline && (
                    <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></span>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <h3 className="font-semibold">
                    {otherUser.name}
                  </h3>

                  <p
                    className={`text-xs font-medium ${
                      isOnline
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
                    {isOnline ? "🟢 Online" : "⚪ Offline"}
                  </p>

                  <p className="text-sm text-gray-500 truncate">
                    {conversation.lastMessage ||
                      "Start a conversation"}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Logout */}
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition font-semibold"
        >
          🚪 Logout
        </button>
      </div>

      {/* User List */}
      {showUserList && (
        <UserList
          onClose={() => setShowUserList(false)}
          getConversations={getConversations}
          setSelectedConversation={setSelectedConversation}
        />
      )}
    </div>
  );
}

export default Sidebar;