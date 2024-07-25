"use client";

import { IMessage, useMessage } from "@/lib/store/messages";
import React, { useEffect, useRef, useState } from "react";
import Message from "./Message";
import { DeleteAlert, EditAlert } from "./MessageActions";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { ArrowDown } from "lucide-react";
import LoadMoreMessages from "./LoadMoreMessages";

const ListMessages = () => {
  // const { messages, addMessage, optimisticIds } = useMessage((state) => state); // zustand에 전역으로 저장된 state를 불러옴. // addMessage는 예전에 만든 메세지를 추가하는 메서드
  const {
    messages,
    addMessage,
    optimisticIds,
    optimisticDeleteMessage,
    optimisticUpdateMessage,
  } = useMessage((state) => state); // zustand에 전역으로 저장된 state를 불러옴. // addMessage는 예전에 만든 메세지를 추가하는 메서드
  const scrollRef = useRef() as React.MutableRefObject<HTMLDivElement>;

  const [userScrolled, setUserScrolled] = useState(false); // scroll관리를 위한 state
  const [notification, setNotification] = useState(0); // 새로운 메세지가 왔을때 notification을 위한 state

  const supabase = createClient();

  useEffect(() => {
    console.log("messages : ", messages);
    const channel = supabase
      .channel("chat-room") // room id를 넣어준다. 여기서는 채팅방이 하나만 있으므로 chat-room으로 전부 통일시킨거다.
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          console.log("Change received!", payload);

          if (optimisticIds.includes(payload.new.id)) {
            return;
          }

          // 받아온 페이로드로 user 정보를 가져오기
          const { error, data } = await supabase
            .from("users")
            .select("*")
            .eq("id", payload.new.user_id)
            .single();

          if (error) {
            toast.error(error.message);
          } else {
            const newMessage = {
              ...payload.new,
              users: data,
            };
            addMessage(newMessage as IMessage);
          }
          setNotification((current) => current + 1);
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "messages" },
        (payload) => {
          console.log("Change received!", payload);
          optimisticDeleteMessage(payload.old.id);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        (payload) => {
          console.log("Change received!", payload);
          optimisticUpdateMessage(payload.new as IMessage);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [messages]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;

    if (scrollContainer && !userScrolled) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  const handleOnScroll = () => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      // scroll 높이를 계산해 밑에있으면 false, 위로 뜨면 true
      const isScroll =
        scrollContainer.scrollTop <
        scrollContainer.scrollHeight - scrollContainer.clientHeight - 10;

      setUserScrolled(isScroll);

      if (!isScroll) {
        setNotification(0);
      }
    }
  };

  // 스크롤을 내려주는 함수
  const scrollDown = () => {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  };

  return (
    <>
      <div
        className="flex-1  flex flex-col p-5 h-full overflow-y-auto"
        ref={scrollRef}
        onScroll={handleOnScroll}
      >
        <div className="flex-1 pb-5">
          <LoadMoreMessages />
        </div>
        <div className="space-y-7">
          {messages.map((value, idx) => {
            return <Message key={idx} message={value} />;
          })}
        </div>
        {/* 아래로 가는 화살표. 아래로 내려갔을때만 표시되도록. */}
        {userScrolled && (
          <div className="absolute bottom-20 w-full">
            {notification ? (
              <div
                className="w-36 mx-auto bg-indigo-500 p-1 rounded-md cursor-pointer hover:scale-110 transition-all"
                onClick={scrollDown}
              >
                <h1>New {notification} Messages</h1>
              </div>
            ) : (
              <div
                className="w-10 h-10 bg-blue-500 rounded-full flex justify-center items-center mx-auto border cursor-pointer hover:scale-110 transition-all"
                onClick={scrollDown}
              >
                <ArrowDown />
              </div>
            )}
          </div>
        )}

        <DeleteAlert />
        <EditAlert />
      </div>
    </>
  );
};

export default ListMessages;
