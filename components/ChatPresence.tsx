// components/ChatPresence.tsx
"use client";

import { useUser } from "@/lib/store/user";
import { createClient } from "@/utils/supabase/client";
import { RealtimePresenceState } from "@supabase/supabase-js";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const ChatPresence = () => {
  const user = useUser((state) => state.user);
  const supabase = createClient();
  const [onlineUsers, setOnlineUsers] = useState(0);

  useEffect(() => {
    const channel = supabase.channel("chat-room1");

    console.log("ChatPresence - channel : ", channel);

    channel
      .on("presence", { event: "sync" }, () => {
        // channel.presenceState()의 type은 '{ presence_ref: string; }'만 되어있기 때문에, 추가로 user_id도 타입으로 설정해준다.
        const newState: RealtimePresenceState<{ user_id: string }> =
          channel.presenceState();
        console.log("sync : ", newState);
        const userIds = [];
        for (const item in newState) {
          const userId = newState[item][0].user_id;
          if (!userId) {
            continue;
          }
          userIds.push(userId);
        }
        console.log("userIDs : ", userIds);

        setOnlineUsers(new Set(userIds).size);
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        console.log("join", key, newPresences);
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        console.log("leave : ", key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status !== "SUBSCRIBED") {
          return;
        }
        // 여기서 track등록을 해주면, sync 이벤트의 channel.presenceState 부분에서 추적할 수 있게 나온다.
        const presenceTrackStatus = await channel.track({
          user_id: user?.id, // user를 추적할 수 있도록.
          online_at: new Date().toISOString(),
          trackTest: "OOOOKKKK!!!",
        });
        console.log("presenceTrackStatus : ", presenceTrackStatus);
      });
  }, [user]); // user의 상태가 변경되면 리 렌더링하도록 user를 넣어준다.

  if (!user) {
    // 로그인 하지 않았을 때는, Presence를 보여주지 않도록.
    return <div className="h-3 w-1"></div>;
  }

  return (
    <div className="flex items-center gap-1">
      <div className="h-4 w-4 bg-green-500 rounded-full animate-pulse"></div>
      <h1 className="text-sm text-gray-400">{onlineUsers} Online</h1>
    </div>
  );
};

export default ChatPresence;
