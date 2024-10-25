import { useFetcher } from "@remix-run/react";
import { ChatDocument } from "../types/chats";
import { action } from "app/routes/app._index";
import { handleResponse } from "../utils/shared";
import { useCallback, useEffect, useState } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Conversation, FetcherProp } from "../types/shared";
import { createCurrentSeconds } from "../utils/converters/time";
import { deleteChat, resolveChat, submitNote } from "app/routes/services/chats";

export const useChats = () => {
  const shopify = useAppBridge();
  const fetcher = useFetcher<typeof action>() as FetcherProp;
  const [chat, setChat] = useState<null | ChatDocument>(null);
  const [chats, setChats] = useState<ChatDocument[]>([]);
  const [error, setError] = useState({ message: "", type: "" });

  const isLoading =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";

  useEffect(() => {
    setError({ message: "", type: "" });
    if (fetcher.data) {
      switch (fetcher.data.type) {
        case "delete": {
          if (fetcher.data.status < 300) {
            const filtered = chats.filter((c) => c.id !== fetcher.data?.data);
            setChats(filtered);
            setChat(null);
          }
          break;
        }
        case "resolve": {
          if (fetcher.data.status < 300) {
            setChat(
              (p) =>
                p && {
                  ...p,
                  status: "resolved",
                  conversation: [
                    ...p.conversation,
                    {
                      time: createCurrentSeconds(),
                      is_note: false,
                      message: "",
                      sender: "agent",
                      action: "closed",
                    } as Conversation,
                  ],
                },
            );
          }
        }
        case "note": {
          if (fetcher.data.status < 300) {
            setChat(
              (p) =>
                p && {
                  ...p,
                  conversation: [
                    ...p.conversation,
                    {
                      time: createCurrentSeconds(),
                      is_note: true,
                      message: fetcher.data?.data,
                      sender: "agent",
                      action: null,
                    } as Conversation,
                  ],
                },
            );
          }
        }
        default:
          break;
      }
      handleResponse(fetcher.data, shopify, setError);
    }
  }, [fetcher.data]);

  // Select Chat
  const handleFetchChat = useCallback(
    (id: string) => {
      const selected = chats.find((c) => c.id == id);
      if (selected) setChat(selected);
    },
    [chat, chats],
  );

  // Delete Chat
  const handleDeleteChat = useCallback(
    async (id: string) => {
      await deleteChat(fetcher, id);
    },
    [fetcher, chats],
  );

  // Resolve Chat  (close & automate)
  const handleResolve = useCallback(
    async (id: string) => {
      if (chat && chat.status !== "open") {
        return;
      }
      await resolveChat(fetcher, id);
    },
    [chat, chats],
  );

  // Add Chat Note
  const handleAddNote = useCallback(
    async (id: string, note: string) => {
      await submitNote(fetcher, id, note);
    },
    [chat, chats],
  );

  return {
    chat,
    chats,
    error,
    isLoading,
    setChat,
    setChats,
    setError,
    handleAddNote,
    handleResolve,
    handleFetchChat,
    handleDeleteChat,
  };
};
