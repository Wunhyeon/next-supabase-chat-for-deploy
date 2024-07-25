import { create } from "zustand";
import { LIMIT_MESSAGE } from "../constant";

export type IMessage = {
  created_at: string;
  id: string;
  is_deleted: string | null;
  is_edit: boolean;
  text: string;
  user_id: string;
  users: {
    avatar_url: string;
    created_at: string;
    deleted_at: string | null;
    display_name: string;
    id: string;
    updated_at: string | null;
  } | null;
};

interface MessageState {
  messages: IMessage[];
  addMessage: (message: IMessage) => void;
  actionMessage: IMessage | undefined;
  setActionMessage: (message: IMessage | undefined) => void;
  optimisticDeleteMessage: (messageId: string) => void;
  optimisticUpdateMessage: (message: IMessage) => void;
  optimisticIds: string[];
  setOptimisticIds: (id: string) => void;
  page: number;
  setMessages: (messages: IMessage[]) => void;
  hasMore: boolean; // LoadMore버튼으로 더 가져올 데이터가 있는지.
}

export const useMessage = create<MessageState>()((set) => ({
  messages: [],
  addMessage: (newMessages) =>
    set((state) => ({
      messages: [...state.messages, newMessages],
    })), // 기존 state에 담겨있던 message들 + 이번에 작성한 메세지
  actionMessage: undefined,
  setActionMessage: (message) => set(() => ({ actionMessage: message })),
  optimisticDeleteMessage: (messageId) =>
    set((state) => {
      return {
        messages: state.messages.filter((message) => message.id != messageId),
      };
    }),
  optimisticUpdateMessage: (updateMessage) =>
    set((state) => {
      return {
        messages: state.messages.filter((message) => {
          if (message.id == updateMessage.id) {
            message.text = updateMessage.text;
            message.is_edit = updateMessage.is_edit;
          }
          return message;
        }),
      };
    }),
  optimisticIds: [],
  setOptimisticIds: (id: string) =>
    set((state) => ({ optimisticIds: [...state.optimisticIds, id] })),
  page: 1,
  setMessages: (messages) =>
    set((state) => ({
      messages: [...messages, ...state.messages],
      page: state.page + 1,
      hasMore: messages.length >= LIMIT_MESSAGE, // 새로 받아온 messages가 LIMIT_MESSAGE보다 많거나 같은지. 예를들어 LIMIT_MESSAGE가 10이고 이번에 새로 받아온 messages가 10이라면 더 가져올 데이터가 있다는 뜻이지만, LIMIT_MESSAGE가 10인데 이번에 새로 받아온 messages가 5라면 더 가져올 데이터가 없다는 뜻이다.
    })),
  hasMore: true, // LoadMore버튼으로 더 가져올 데이터가 있는지.
}));
