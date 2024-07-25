// components/ChatAbout.tsx
import React from "react";

const ChatAbout = () => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center space-y-5">
        <h1 className="text-3xl font-bold">Welcome to Datil Chat</h1>
        <p className="w-96">
          환영합니다! Please Login to send Message. Powered by NextJs + Supabase
        </p>
      </div>
    </div>
  );
};

export default ChatAbout;
