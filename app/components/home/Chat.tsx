import {
  Action,
  AgentChat,
  CustomerChat,
  Note,
  SuggestedEmail,
} from "./Conversation";
import {
  DeleteIcon,
  ReceiptRefundIcon,
  NoteAddIcon,
  SendIcon,
  EmailIcon,
} from "@shopify/polaris-icons";
import { useCallback, useState } from "react";
import { ChatDocument } from "app/lib/types/chats";
import { EmailDocument } from "app/lib/types/emails";
import { SkeletonConvo, SkeletonHdr } from "./Skeleton";
import { capitalizeWords, isValidEmail } from "app/lib/utils/converters/text";
import {
  ActionList,
  Button,
  Icon,
  Popover,
  Text,
  TextField,
} from "@shopify/polaris";

export const Chat = ({
  chat,
  isLoading,
  deleteChat,
  resolve,
  addNote,
  handleSendEmail,
}: {
  chat: null | ChatDocument | EmailDocument;
  isLoading: boolean;
  deleteChat: (id: string) => Promise<void>;
  resolve: (id: string) => Promise<void>;
  addNote: (id: string, note: string) => Promise<void>;
  handleSendEmail: (
    email: string,
    subject: string,
    message: string,
  ) => Promise<void>;
}) => {
  const [loading, setLoading] = useState(false);
  const [popoverActive, setPopoverActive] = useState(false);
  const [note, setNote] = useState("");
  const [type, setType] = useState<"email" | "note">("note");
  const handleChange = useCallback((newValue: string) => setNote(newValue), []);

  // Submit note to be added
  const handleAddNote = useCallback(async () => {
    setLoading(true);
    if (!chat || !chat.id) {
      setLoading(false);
      return;
    }
    if (note == "") {
      setLoading(false);
      return;
    }

    await addNote(String(chat?.id || ""), note);

    setNote("");
    setLoading(false);
  }, [note, chat, loading]);

  // Select Email to edit/send
  const handleSelectEmail = (id: string) => {
    const message = chat?.conversation.find((m) => `${m.time}` == id);
    if (!message) return;

    setType("email");
    setNote(message.message);
  };

  // Popup Text Type Selector
  const handleSelectingType = (type: "email" | "note") => {
    setPopoverActive(false);
    setType(type);
    setNote("");
  };

  // Send email
  const handleEmailToBeSent = useCallback(async () => {
    setLoading(true);
    if (!chat || !chat.id || note == "" || !isValidEmail(chat.id)) {
      setLoading(false);
      return;
    }

    await handleSendEmail(chat.id, "Follow up from CS Ticket", note);

    setNote("");
    setLoading(false);
  }, [note, chat, loading]);

  const activator = (
    <Button onClick={() => setPopoverActive(!popoverActive)} disclosure>
      Choose
    </Button>
  );

  return (
    <>
      <style>
        {`
            .chatWrapper {
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
              align-items: center;
              height: 100%;
              width: 100%;
              position: relative;
              margin: 0;
              padding: 0px;
            }
            
            .chatWrapper > header {
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
              height: 50px;
              width: 100%;
              position: relative;
              margin: 0;
              padding: 10px;
              border-bottom: 1px solid var(--p-color-bg-surface-tertiary-hover);
            }

            .chatWrapper > header > .hdrRigt {
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
              height: auto;
              width: auto;
              position: relative;
              margin: 0;
              padding: 10px;
            }

            .chatWrapper > header > .hdrRigt > button {
              margin-left: 5px;
            }


            .convoWrapper {
              flex-grow: 1; 
              overflow-y: auto;
              height: auto;
              width: 100%;
              position: relative;
              margin: 0;
              overflow-y: scroll;
              padding: 10px;
            }

            .msgWrapper {
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
              align-items: flex-start;
              height: auto;
              width: 100%;
              position: relative;
              margin: 20px 0;
              padding: 0;
            }

            .actionText {
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
              align-items: center;
              height: auto;
              width: 100%;
              position: relative;
              margin: 0;
              padding: 0;
            }

            .msg {
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
              align-items: flex-start;
              height: auto;
              width: fit-content;
              max-width: 80%;
              width: content-fit;
              position: relative;
              overflow: hidden;
              margin: 0;
              padding: 10px;
              border-radius: var(--p-border-radius-300);
              background: #EEF1F1;
            }

            .img-msg {
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
              align-items: flex-start;
              height: auto;
              width: fit-content;
              max-width: 80%;
              width: content-fit;
              position: relative;
              overflow: hidden;
              margin: 10px 0 0 0;
              padding: 10px;
              border-radius: var(--p-border-radius-300);
              background: #EEF1F1;
            }

            .img-msg > img {
              border-radius: 5px;
              object-fit: contain;
              max-width: 100%;
              max-height: 400px;
            }
            
            .msg > div {
              width: 100%;
              position: relative;
            }
            
            .msg > div a,
            .msg > div p {
              margin-bottom: 20px;
              width: 100%;
              display: block;
              overflow: hidden;
              /* text-decoration: double; */
              text-overflow: ellipsis;
            }

            .msg > div a:last-of-type,
            .msg > div p:last-of-type {
              margin-bottom: 5px;
            }


            .msgWrapper > p {
              margin-top: 5px;
            }

            .msg pre, .msg p, .msg a, .msg code {
              width: 100%;
              white-space: pre-wrap;
              word-wrap: break-word;
              word-break: break-word;
              overflow-wrap: break-word;
              height: auto;
              display: block;
              margin-bottom: 7px;
              font-size: 13px;
              font-family: sans-serif;
              font-weight: 350;
            }

            .chatFooterWrapper {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: flex-start;
              height: 200px;
              width: 100%;
              position: relative;
              margin: 0;
              padding: 10px;
            }

            .txtContainer {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: flex-start;
              height: auto;
              width: 100%;
              position: relative;
              margin: 0;
              padding: 10px;
              background: var(--p-color-bg-surface);
              border-radius: var(--p-border-radius-300);
              box-shadow: 0rem 0 1rem 0rem rgb(26 26 26 / 17%);
            }

            .txtContainer > div {
              width: 100%;
            }
            .txtField {
              width: 100%;
            }
            .txtField div {
              border: none !important;
            }

            .txtField textarea {
              max-height: 90px;
            }

            .txtContainerHdr {
              display: flex;
              flex-direction: row;
              justify-content: flex-start;
              align-items: center;
              height: auto;
              width: 100%;
              position: relative;
              margin: 0;
              padding: 0px;
              margin-bottom: 10px
            }

            .txtContainerHdr > span {
              margin: 0;
              margin-right: 5px;
            }

            .txtContainerFooter {
              display: flex;
              flex-direction: row;
              justify-content: flex-end;
              align-items: center;
              height: auto;
              width: 100%;
              position: relative;
              margin: 0;
              padding: 0px;
              margin-top: 10px
            }

        `}
      </style>

      <div className={"chatWrapper"}>
        {chat ? (
          <header>
            <Text variant="headingLg" as={"strong"} truncate={true}>
              {chat.customer
                ? capitalizeWords(
                    `${chat.customer.first_name} ${chat.customer.last_name}`,
                  )
                : chat.email
                  ? chat.email
                  : "Anonymous"}
            </Text>
            <div className="hdrRigt">
              <Button
                icon={DeleteIcon}
                variant="tertiary"
                loading={isLoading}
                onClick={() => deleteChat(chat.id)}
                tone="critical"
              >
                Delete
              </Button>
              <Button
                icon={ReceiptRefundIcon}
                variant="primary"
                loading={isLoading}
                disabled={chat.status == "resolved"}
                onClick={() => resolve(chat.id)}
              >
                Resolve{`${chat.status == "resolved" ? "d" : ""}`}
              </Button>
            </div>
          </header>
        ) : (
          <SkeletonHdr />
        )}

        {chat ? (
          <div className={"convoWrapper"}>
            {chat.conversation &&
              chat.conversation.map((chat, index) => {
                if (chat.sender == "agent" && !chat.action && !chat.is_note) {
                  return <AgentChat chat={chat} />;
                }

                if (
                  chat.sender == "customer" &&
                  !chat.action &&
                  !chat.is_note
                ) {
                  return <CustomerChat chat={chat as any} />;
                }

                if (chat.action) {
                  return <Action chat={chat} />;
                }

                if (chat.is_note) {
                  return <Note chat={chat} />;
                }
                if (chat.sender == "email" && !chat.action && !chat.is_note) {
                  return (
                    <SuggestedEmail chat={chat} onCick={handleSelectEmail} />
                  );
                }
              })}
            {/* {loading && <div>Loading more chats...</div>} */}
          </div>
        ) : (
          <SkeletonConvo />
        )}

        <footer className="chatFooterWrapper">
          <div className="txtContainer">
            <div className="txtContainerHdr">
              <Popover
                active={popoverActive}
                activator={activator}
                autofocusTarget="first-node"
                onClose={() => setPopoverActive(false)}
              >
                <ActionList
                  actionRole="menuitem"
                  items={[
                    {
                      content: "Add Note",
                      icon: NoteAddIcon,
                      onAction: () => handleSelectingType("note"),
                    },
                    {
                      content: "Write Email",
                      icon: EmailIcon,
                      onAction: () => handleSelectingType("email"),
                    },
                  ]}
                />
              </Popover>
              <Icon source={type == "note" ? NoteAddIcon : EmailIcon} />
              <Text variant="bodySm" as={"p"} tone="subdued">
                {type == "note" ? "Add Note" : "Send Email"}
              </Text>
            </div>
            <div className="txtField">
              <TextField
                label=""
                placeholder="write here...."
                value={note}
                onChange={handleChange}
                multiline={4}
                autoComplete="off"
              />
            </div>
            <div className="txtContainerFooter">
              {type == "note" ? (
                <Button
                  disabled={loading || isLoading}
                  loading={loading || isLoading}
                  icon={SendIcon}
                  variant="primary"
                  onClick={handleAddNote}
                >
                  Submit Note
                </Button>
              ) : (
                <Button
                  disabled={loading || isLoading}
                  loading={loading || isLoading}
                  icon={SendIcon}
                  variant="primary"
                  onClick={handleEmailToBeSent}
                >
                  Send Email
                </Button>
              )}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};
