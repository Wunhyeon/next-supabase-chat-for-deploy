"use client";

import React from "react";
import { Input } from "./ui/input";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid"; // uuid import
import { useUser } from "@/lib/store/user"; // user 정보를 불러온다.
import { IMessage, useMessage } from "@/lib/store/messages";

export const ChatInput = () => {
  const supabase = createClient();

  const user = useUser((state) => state.user); // user 정보를 불러온다.
  const { addMessage, optimisticIds } = useMessage((state) => state); // addMessage function을 불러온다.
  const setOptimisticIDs = useMessage((state) => state.setOptimisticIds);

  // 메세지 전송 펑션
  const handleSendMessage = async (text: string) => {
    // 빈 메세지가 오지 못하도록 처리
    if (!text.trim().length) {
      toast.error("Message cant not be empty");
      return;
    }

    const newMessage = {
      id: uuidv4(),
      text,
      // user_id: user?.id,
      is_edit: false,
      // created_at: new Date().toISOString(),
    };

    const { data, error, status } = await supabase
      .from("messages")
      .insert(newMessage);

    // optimistic update에 사용될 newMessage객체
    const newMessageForOpt = {
      ...newMessage,
      users: {
        id: user?.id,
        avatar_url: user?.user_metadata.avatar_url,
        created_at: new Date().toISOString(),
        display_name: user?.user_metadata.user_name,
      },
    };

    console.log("newMessage.id : ", newMessage.id);

    addMessage(newMessageForOpt as IMessage); // 불러온 addMessage 펑션 사용하기
    setOptimisticIDs(newMessageForOpt.id);

    if (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <div className="p-5">
      <Input
        placeholder="send message"
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.nativeEvent.isComposing === false) {
            // enter 키를 누르면 메세지가 전송되도록.
            // e.nativeEvent.isComposing === false - 한글 두번 입력현상 방지
            handleSendMessage(e.currentTarget.value);
            e.currentTarget.value = ""; // 메세지를 전송하고 나서 칸을 비워준다.
          }
        }}
      />
    </div>
  );
};
