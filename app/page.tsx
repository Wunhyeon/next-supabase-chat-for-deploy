import ChatAbout from "@/components/ChatAbout";
import ChatHeader from "@/components/ChatHeader";
import { ChatInput } from "@/components/ChatInput";
import ChatMessages from "@/components/ChatMessages";
import ListMessages from "@/components/ListMessages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import InitUser from "@/lib/store/InitUser";
import { createClient } from "@/utils/supabase/server"; // supabase 객체 불러오기. // 서버 컴포넌트니깐 서버에서 임포트해온다.
import React from "react";

const page = async () => {
  const supabase = createClient(); // supabase 객체 불러오기.

  // const session = await supabase.auth.getSession();
  // console.log(session.data.session?.user);

  const user = (await supabase.auth.getUser()).data.user;
  // console.log("user: ", user);

  return (
    <>
      <div className="max-w-3xl mx-auto md:py-10 h-screen">
        <div className="h-full border rounded-md flex flex-col relative">
          <ChatHeader user={user} />
          {user ? (
            <>
              <ChatMessages />
              <ChatInput />
            </>
          ) : (
            <ChatAbout />
          )}
        </div>
      </div>
      <InitUser user={user} />
      {/* user state 관리를 시작할 수 있도록. */}
    </>
  );
};

export default page;
