import { useEffect, useState } from "react";
import API from "../api/axios";

function UserList({
  onClose,
  getConversations,
  setSelectedConversation,
}) {
  const [users, setUsers] = useState([]);

  // Fetch all users
  const getUsers = async () => {
    try {
      const response = await API.get("/auth/users");
      setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Create Conversation
  const createConversation = async (receiverId) => {
    try {
      const response = await API.post("/conversations", {
        receiverId,
      });

      // Select the newly created conversation
      setSelectedConversation(response.data);

      // Refresh Sidebar
      await getConversations();

      // Close Popup
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-96 rounded-xl shadow-xl p-5">

        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold">
            New Chat
          </h2>

          <button
            onClick={onClose}
            className="text-xl font-bold hover:text-red-500"
          >
            ✕
          </button>
        </div>

        {/* User List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">

          {users.length === 0 ? (
            <p className="text-center text-gray-500">
              No Users Found
            </p>
          ) : (
            users.map((user) => (
              <div
                key={user._id}
                onClick={() => createConversation(user._id)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition"
              >
                <img
                  src={
                    user.profile_picture ||
                    `https://ui-avatars.com/api/?name=${user.name}`
                  }
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />

                <div>
                  <h3 className="font-semibold">
                    {user.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {user.email}
                  </p>
                </div>
              </div>
            ))
          )}

        </div>

      </div>
    </div>
  );
}

export default UserList;