import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import UserList from "./UserList";

function Sidebar({
  selectedConversation,
  setSelectedConversation,
}) {
  const { user } = useContext(AuthContext);

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

  useEffect(() => {
    getConversations();
  }, []);

  return (
    <div className="w-80 h-screen border-r bg-white flex flex-col">

      {/* Current User */}
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">
          {user?.name}
        </h2>

        <p className="text-sm text-gray-500">
          {user?.email}
        </p>
      </div>

      {/* New Chat Button */}
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

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">

        {conversations.length === 0 ? (
          <p className="text-center text-gray-500 mt-5">
            No Conversations Found
          </p>
        ) : (
          conversations.map((conversation) => {

            const otherUser = conversation.participants.find(
              (participant) => participant._id !== user?._id
            );

            if (!otherUser) return null;

            return (
              <div
                key={conversation._id}
                onClick={() => setSelectedConversation(conversation)}
                className={`flex items-center gap-3 p-4 border-b cursor-pointer hover:bg-gray-100 ${
                  selectedConversation?._id === conversation._id
                    ? "bg-blue-100"
                    : ""
                }`}
              >

                <img
                  src={
                    otherUser.profile_picture ||
                    `https://ui-avatars.com/api/?name=${otherUser.name}`
                  }
                  alt={otherUser.name}
                  className="w-12 h-12 rounded-full object-cover"
                />

                <div>
                  <h3 className="font-semibold">
                    {otherUser.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {conversation.lastMessage || "Start a conversation"}
                  </p>
                </div>

              </div>
            );
          })
        )}

      </div>

      {/* User List Popup */}
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