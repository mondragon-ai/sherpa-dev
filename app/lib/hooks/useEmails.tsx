import {
  deleteEmail,
  fetchEmail,
  fetchNext,
  filterEmail,
  resolveEmail,
  sendEmail,
  submitNote,
} from "app/routes/services/emails";
import { useFetcher } from "@remix-run/react";
import { action } from "app/routes/app.emails";
import { EmailDocument } from "../types/emails";
import { handleResponse } from "../utils/shared";
import { useCallback, useEffect, useState } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Conversation, EmailConversation, FetcherProp } from "../types/shared";
import { createCurrentSeconds } from "../utils/converters/time";

export const useEmails = () => {
  const shopify = useAppBridge();
  const fetcher = useFetcher<typeof action>() as FetcherProp;
  const [emails, setEmails] = useState<EmailDocument[]>([]);
  const [error, setError] = useState({ message: "", type: "" });
  const [email, setEmail] = useState<null | EmailDocument>(null);

  const isLoading =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";

  useEffect(() => {
    setError({ message: "", type: "" });
    if (fetcher.data) {
      switch (fetcher.data.type) {
        case "delete": {
          if (fetcher.data.status < 300 && fetcher.data.type == "delete") {
            const filtered = emails.filter((c) => c.id !== fetcher.data?.data);
            setEmails(filtered);
            setEmail(null);
          }
          break;
        }

        case "resolve": {
          if (fetcher.data.status < 300 && fetcher.data.type == "resolve") {
            setEmail(
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
                      id: `${createCurrentSeconds()}`,
                      history_id: "",
                      internal_date: "",
                      from: "",
                      subject: "",
                      attachments: [],
                    } as EmailConversation,
                  ],
                },
            );
            const map = emails.map((c) => {
              if (c.id == email?.id) {
                return {
                  ...c,
                  status: "resolved" as any,
                };
              }
              return c;
            });
            setEmails(map);
          }
        }

        case "note": {
          if (fetcher.data.status < 300 && fetcher.data.type == "note") {
            setEmail(
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
                      id: `${createCurrentSeconds()}`,
                      history_id: "",
                      internal_date: "",
                      from: "",
                      subject: "",
                      attachments: [],
                    } as EmailConversation,
                  ],
                },
            );
          }
        }

        case "send_email": {
          if (fetcher.data.status < 300 && fetcher.data.type == "send_email") {
            setEmail(
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
            setEmails(fetcher.data.data as unknown as EmailDocument[]);
          }
        }

        case "request": {
          if (fetcher.data.status < 300 && fetcher.data.type == "request") {
            setEmail(fetcher.data.data as unknown as EmailDocument);
          }
        }

        case "next": {
          if (fetcher.data.status < 300 && fetcher.data.type == "next") {
            if (!fetcher.data || !fetcher.data.data) return;

            if (fetcher.data && fetcher.data.data && fetcher.data.data.length) {
              setEmails((p) => p && [...p, ...fetcher?.data?.data]);
            }
          }
        }

        default:
          break;
      }
      handleResponse(fetcher.data, shopify, setError);
    }
  }, [fetcher.data]);

  // Select Email
  const handleFetchEmail = useCallback(
    (id: string) => {
      const selected = emails.find((c) => c.id == id);
      if (selected) setEmail(selected);
    },
    [email, emails],
  );

  // Delete Email
  const handleDeleteEmail = useCallback(
    async (id: string) => {
      await deleteEmail(fetcher, id);
    },
    [fetcher, emails],
  );

  // Resolve Email  (close & automate)
  const handleResolve = useCallback(
    async (id: string) => {
      if (!email) return;
      if (email.status == "resolved") {
        return;
      }
      await resolveEmail(fetcher, { email: email.id, type: "email" });
    },
    [email, emails],
  );

  // Add Email Note
  const handleAddNote = useCallback(
    async (id: string, note: string) => {
      await submitNote(fetcher, id, note);
    },
    [email, emails],
  );

  // Filter Email list
  const handleFilter = useCallback(
    async (query: "newest" | "open" | "action_required") => {
      await filterEmail(fetcher, query);
    },
    [email, emails],
  );

  // Fetch Email (algolia)
  const handleRequestEmail = useCallback(
    async (id: string) => {
      await fetchEmail(fetcher, id);
    },
    [email, emails],
  );

  // Fetch next 250 chats (infinity scroll)
  const handleFetchNext = useCallback(
    async (time: number) => {
      await fetchNext(fetcher, time);
    },
    [email, emails],
  );

  // Send Email
  const handleSendEmail = useCallback(
    async (email: string, subject: string, message: string) => {
      const payload = { to: email, subject, email: message };
      console.log({ HOOK: payload });
      await sendEmail(fetcher, payload);
    },
    [email, emails],
  );

  return {
    email,
    emails,
    error,
    isLoading,
    setEmail,
    setEmails,
    setError,
    handleFilter,
    handleAddNote,
    handleResolve,
    handleFetchEmail,
    handleDeleteEmail,
    handleRequestEmail,
    handleFetchNext,
    handleSendEmail,
  };
};
