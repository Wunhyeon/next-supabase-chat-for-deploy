import React, { Suspense } from "react";
import ListMessages from "./ListMessages";
import { createClient } from "@/utils/supabase/server";
import InitMessages from "@/lib/store/InitMessages";
import { LIMIT_MESSAGE } from "@/lib/constant";
import { getFromAndTo } from "@/lib/utils";

const ChatMessages = async () => {
  const supabase = createClient();

  const { from, to } = getFromAndTo(0, LIMIT_MESSAGE);
  const result = await supabase
    .from("messages")
    .select("*,users(*)")
    // .range(0, LIMIT_MESSAGE)
    .range(from, to)
    .order("created_at", { ascending: false });

  return (
    <Suspense fallback={"loading..."}>
      <ListMessages />
      <InitMessages messages={result.data?.reverse() || []} />
      {/* result.data는 null 이 올수도 있는데, InitMessages에서는 props로 IMessages[]만 받고있으므로 null일경우 빈배열을 넣어주기 위해 || []를 해줌. */}
    </Suspense>
  );
};

export default ChatMessages;
