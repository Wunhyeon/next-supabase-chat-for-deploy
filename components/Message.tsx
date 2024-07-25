import { IMessage, useMessage } from "@/lib/store/messages";
import Image from "next/image";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { useUser } from "@/lib/store/user";

const MessageMenu = ({ message }: { message: IMessage }) => {
  // 1. props로 메세지를 받는다.
  const setActionMessage = useMessage((state) => state.setActionMessage); // 2. setActionMessage를 state에서 받아온다.

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Action</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            document.getElementById("trigger-edit")?.click();
            setActionMessage(message);
          }}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            document.getElementById("trigger-delete")?.click();
            setActionMessage(message); // 3. setActionMessage로 actionMessage에 props로 받아온 메세지를 설정해준다.
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Message = ({ message }: { message: IMessage }) => {
  const user = useUser((state) => state.user); // 유저 정보 가져오기

  return (
    <div className="flex gap-2">
      <div>
        <Image
          src={message.users?.avatar_url!}
          alt={message.users?.display_name!}
          width={40}
          height={40}
          className="rounded-full right-2"
        />
      </div>

      <div className="flex-1">
        <div className="flex items-center  justify-between">
          <div className="flex items-center gap-1">
            <h1 className="font-bold">{message.users?.display_name}</h1>
            <h1 className="text-sm text-gray-400">
              {new Date(message.created_at).toDateString()}
            </h1>
            {
              // 요기!! 수정되었다고 표시
              message.is_edit && (
                <h1 className="text-sm text-gray-400">edited</h1>
              )
            }
          </div>
          {/* props로 메세지를 넘겨준다. */}
          {message.users?.id === user?.id && <MessageMenu message={message} />}
        </div>
        <p className="text-gray-300">{message.text}</p>
      </div>
    </div>
  );
};

export default Message;
