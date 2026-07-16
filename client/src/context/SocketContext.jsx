import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {

    if (!user) {
      if (socket) {
        socket.disconnect();
      }

      setSocket(null);
      setOnlineUsers([]);
      return;
    }

    
    const socketInstance = io("http://localhost:5000", {
      query: {
        userId: user._id,
      },
      withCredentials: true,
    });

    setSocket(socketInstance);


    socketInstance.on("getOnlineUsers", (users) => {
      // console.log("🟢 Online Users:", users);
      setOnlineUsers(users);
    });

   
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