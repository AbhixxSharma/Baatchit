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
    <div className="w-80 h-screen bg-slate-50 border-r border-slate-200 flex flex-col shadow-xl">

     

      <div className="p-5 border-b bg-white">

        <div className="flex items-center gap-3">

          <img
            src={`https://ui-avatars.com/api/?background=10b981&color=fff&name=${user?.name}`}
            alt={user?.name}
            className="w-14 h-14 rounded-full shadow-md"
          />

          <div>

            <h2 className="font-bold text-lg text-slate-800">
              {user?.name}
            </h2>

            <p className="text-sm text-slate-500">
              {user?.email}
            </p>

          </div>

        </div>

      </div>

     
      <div className="p-4 bg-white border-b">

        <button
          onClick={() => setShowUserList(true)}
          className="
          w-full
          py-3
          rounded-xl
          bg-gradient-to-r
          from-emerald-500
          to-green-600
          text-white
          font-semibold
          transition-all
          duration-300
          hover:scale-[1.03]
          hover:shadow-xl
          hover:shadow-emerald-300
          active:scale-95
          "
        >
          + New Chat
        </button>

      </div>

   

      <div className="p-4 bg-white border-b">

        <input
          type="text"
          placeholder="Search conversations..."
          className="
          w-full
          rounded-xl
          border
          border-slate-300
          px-4
          py-3
          outline-none
          bg-slate-50
          focus:ring-2
          focus:ring-emerald-400
          transition-all
          "
        />

      </div>

    
      <div className="flex-1 overflow-y-auto py-2">

        {conversations.length === 0 ? (

          <p className="text-center text-slate-500 mt-6">
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

            return (

              <div
                key={conversation._id}
                onClick={() =>
                  setSelectedConversation(conversation)
                }
                className={`
                mx-3
                my-2
                rounded-2xl
                cursor-pointer
                transition-all
                duration-300
                hover:bg-white
                hover:shadow-lg
                hover:scale-[1.02]
                hover:-translate-y-1

                ${
                  selectedConversation?._id ===
                  conversation._id
                    ? "bg-emerald-100 border-l-4 border-emerald-500 shadow-md"
                    : ""
                }
                `}
              >

                <div className="flex items-center gap-3 p-3">

                  

                  <div className="relative">

                    <img
                      src={
                        otherUser.profile_picture ||
                        `https://ui-avatars.com/api/?background=10b981&color=fff&name=${otherUser.name}`
                      }
                      alt={otherUser.name}
                      className="
                      w-14
                      h-14
                      rounded-full
                      object-cover
                      shadow-md
                      transition-transform
                      duration-300
                      hover:scale-110
                      "
                    />

                    {isOnline && (

                      <span
                        className="
                        absolute
                        bottom-1
                        right-1
                        w-3.5
                        h-3.5
                        rounded-full
                        bg-emerald-500
                        ring-2
                        ring-white
                        animate-pulse
                        "
                      />

                    )}

                  </div>

                  

                  <div className="flex-1">

                    <h3 className="font-semibold text-slate-800">
                      {otherUser.name}
                    </h3>

                    <p
                      className={`text-xs font-medium ${
                        isOnline
                          ? "text-emerald-600"
                          : "text-slate-400"
                      }`}
                    >
                      {isOnline ? "Online" : "Offline"}
                    </p>

                    <p className="text-sm text-slate-500 truncate mt-1">
                      {conversation.lastMessage ||
                        "Start chatting..."}
                    </p>

                  </div>

                </div>

              </div>

            );

          })

        )}

      </div>

    

      <div className="p-4 border-t bg-white">

        <button
          onClick={handleLogout}
          className="
          w-full
          py-3
          rounded-xl
          font-semibold
          text-white
          bg-gradient-to-r
          from-red-500
          to-rose-600
          transition-all
          duration-300
          hover:scale-[1.03]
          hover:shadow-xl
          hover:shadow-red-300
          active:scale-95
          "
        >
          Logout
        </button>

      </div>

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