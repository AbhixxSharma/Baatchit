import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";

createRoot(document.getElementById("root")).render(
  
    <AuthProvider>
      <SocketProvider>
      <BrowserRouter>
      

        <Toaster
          position="top-right"
          reverseOrder={false}
        />

        <App />

      </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  
);