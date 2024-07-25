// components/ChatHeader.tsx
"use client";

import React from "react";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation"; // 주의할 점. next/navigation에서 임포트한다.
import ChatPresence from "./ChatPresence";
import { useUser } from "@/lib/store/user";

const ChatHeader = ({ user }: { user: User | null }) => {
  const router = useRouter();
  const setUser = useUser((state) => state.setUser);

  // props로 UserResponse를 받는다.
  const handleLoginWithGithub = () => {
    const supabase = createClient();
    supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: location.origin + "/auth/callback",
      },
    });
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    // const { error } = await supabase.auth.signOut();
    user = null;
    setUser(null);
    router.refresh();
  };

  return (
    <div className="h-20">
      <div className="p-5 border-b flex items-center justify-between h-full">
        <div>
          <h1 className="text-xl font-bold">Daily Chat</h1>
          <ChatPresence />
        </div>
        {user ? ( // user가 있으면 (로그인했으면) 로그아웃 버튼 표시, 없으면 (로그인 안했으면) 로그인 버튼 표시
          <Button onClick={handleLogout}>Logout</Button>
        ) : (
          <Button onClick={handleLoginWithGithub}>Login</Button>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
