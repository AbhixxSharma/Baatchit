

import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import MessageContainer from "../../components/MessageContainer";

function Chat() {

  const [selectedConversation, setSelectedConversation] = useState(null);

  return (
    <div className="flex h-screen">

      <Sidebar
        selectedConversation={selectedConversation}
        setSelectedConversation={setSelectedConversation}
      />

      <MessageContainer
        selectedConversation={selectedConversation}
      />

    </div>
  );
}

export default Chat;