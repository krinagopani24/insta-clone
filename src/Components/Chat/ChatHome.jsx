import React from "react";
import "./style.css";
import Chat from "./components/Chat";
import Sidebar from "./components/Sidebar";
import { ChatContextProvider } from "../../hooks/ChatContext";

const ChatHome = () => {
  return (
    <ChatContextProvider>
      <div className="home">
        <div className="container">
          <Sidebar />
          <Chat />
        </div>
      </div>
    </ChatContextProvider>
  );
};

export default ChatHome;
