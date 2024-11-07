import { useFetcher } from "@remix-run/react";
import { ChatDocument } from "../types/chats";
import { action } from "app/routes/app._index";
import { handleResponse } from "../utils/shared";
import { useCallback, useEffect, useState } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Conversation, FetcherProp } from "../types/shared";
import { createCurrentSeconds } from "../utils/converters/time";
import {
  deleteChat,
  fetchChat,
  filterChat,
  resolveChat,
  submitNote,
  fetchNext,
  sendEmail,
} from "app/routes/services/chats";

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
          if (fetcher.data.status < 300 && fetcher.data.type == "delete") {
            const filtered = chats.filter((c) => c.id !== fetcher.data?.data);
            setChats(filtered);
            setChat(null);
          }
          break;
        }

        case "resolve": {
          if (fetcher.data.status < 300 && fetcher.data.type == "resolve") {
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
            const map = chats.map((c) => {
              if (c.id == chat?.id) {
                return {
                  ...c,
                  status: "resolved" as any,
                };
              }
              return c;
            });
            setChats(map);
          }
        }

        case "note": {
          if (fetcher.data.status < 300 && fetcher.data.type == "note") {
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

        case "send_email": {
          if (fetcher.data.status < 300 && fetcher.data.type == "send_email") {
            setChat(
              (p) =>
                p && {
                  ...p,
                  email_sent: true,
                },
            );
          }
        }

        case "filter": {
          if (fetcher.data.status < 300 && fetcher.data.type == "filter") {
            setChats(fetcher.data.data as unknown as ChatDocument[]);
          }
        }

        case "request": {
          if (fetcher.data.status < 300 && fetcher.data.type == "request") {
            setChat(fetcher.data.data as unknown as ChatDocument);
          }
        }

        case "next": {
          if (fetcher.data.status < 300 && fetcher.data.type == "next") {
            if (!fetcher.data || !fetcher.data.data) return;

            if (fetcher.data && fetcher.data.data && fetcher.data.data.length) {
              setChats((p) => p && [...p, ...fetcher?.data?.data]);
            }
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
      if (!chat) return;
      if (chat.status == "resolved") {
        return;
      }
      await resolveChat(fetcher, { email: chat.id, type: "chat" });
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

  // Filter Chat list
  const handleFilter = useCallback(
    async (query: "newest" | "open" | "action_required") => {
      await filterChat(fetcher, query);
    },
    [chat, chats],
  );

  // Fetch Single chat (algolia)
  const handleRequestChat = useCallback(
    async (id: string) => {
      console.log(id);
      await fetchChat(fetcher, id);
    },
    [chat, chats],
  );

  // Fetch next 250 chats (infinity scroll)
  const handleFetchNext = useCallback(
    async (time: number) => {
      await fetchNext(fetcher, time);
    },
    [chat, chats],
  );

  // Send Email
  const handleSendEmail = useCallback(
    async (email: string, subject: string, message: string) => {
      const payload = { to: email, subject, email: message };
      console.log({ HOOK: payload });
      await sendEmail(fetcher, payload);
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
    handleFilter,
    handleAddNote,
    handleResolve,
    handleFetchChat,
    handleDeleteChat,
    handleRequestChat,
    handleFetchNext,
    handleSendEmail,
  };
};
