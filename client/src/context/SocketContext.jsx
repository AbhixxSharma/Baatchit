import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    // If user is not logged in
    if (!user) {
      if (socket) {
        socket.disconnect();
      }

      setSocket(null);
      setOnlineUsers([]);
      return;
    }

    // Connect Socket
    const socketInstance = io("http://localhost:5000", {
      query: {
        userId: user._id,
      },
      withCredentials: true,
    });

    setSocket(socketInstance);

    // Listen for online users
    socketInstance.on("getOnlineUsers", (users) => {
      console.log("🟢 Online Users:", users);
      setOnlineUsers(users);
    });

    // Cleanup
    return () => {
      socketInstance.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineUsers,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};