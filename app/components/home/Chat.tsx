import { Button, Icon, Text, TextField } from "@shopify/polaris";
import {
  DeleteIcon,
  ReceiptRefundIcon,
  NoteAddIcon,
  SendIcon,
} from "@shopify/polaris-icons";
import { ChatDocument } from "app/lib/types/chats";
import { SkeletonConvo, SkeletonHdr } from "./Skeleton";
import {
  Action,
  AgentChat,
  CustomerChat,
  Note,
  SuggestedEmail,
} from "./Conversation";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { EmailDocument } from "app/lib/types/emails";
import { capitalizeWords } from "app/lib/utils/converters/text";

export const Chat = ({
  chat,
  deleteChat,
  resolve,
  addNote,
  isLoading,
}: {
  chat: null | ChatDocument | EmailDocument;
  deleteChat: (id: string) => Promise<void>;
  resolve: (id: string) => Promise<void>;
  addNote: (id: string, note: string) => Promise<void>;
  isLoading: boolean;
}) => {
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("add note here....");
  const handleChange = useCallback((newValue: string) => setNote(newValue), []);

  const handleAddNote = useCallback(async () => {
    setLoading(true);
    if (!chat || !chat.id) return;
    if (note == "") return;

    await addNote(String(chat?.id || ""), note);

    setNote("");
    // setLoading(false);
  }, [note, chat, loading]);

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
            <Text variant="headingLg" as={"strong"}>
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
                  return <CustomerChat chat={chat} />;
                }

                if (chat.action) {
                  return <Action chat={chat} />;
                }

                if (chat.is_note) {
                  return <Note chat={chat} />;
                }
                if (chat.sender == "email" && !chat.action && !chat.is_note) {
                  return <SuggestedEmail chat={chat} />;
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
              <Icon source={NoteAddIcon} />
              <Text variant="bodySm" as={"p"} tone="subdued">
                Add Note
              </Text>
            </div>
            <div className="txtField">
              <TextField
                label=""
                value={note}
                onChange={handleChange}
                multiline={4}
                autoComplete="off"
              />
            </div>
            <div className="txtContainerFooter">
              <Button
                disabled={loading || isLoading}
                loading={loading || isLoading}
                icon={SendIcon}
                variant="primary"
                onClick={handleAddNote}
              >
                Submit
              </Button>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};
