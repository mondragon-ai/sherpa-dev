import { Button, Icon, Text, TextField } from "@shopify/polaris";
import {
  DeleteIcon,
  ReceiptRefundIcon,
  NoteAddIcon,
  SendIcon,
} from "@shopify/polaris-icons";
import { ChatDocument } from "app/lib/types/chats";
import { SkeletonConvo, SkeletonHdr } from "./Skeleton";
import { Action, AgentChat, CustomerChat, Note } from "./Conversation";
import { Dispatch, SetStateAction, useCallback, useState } from "react";

export const Chat = ({
  chat,
  deleteChat,
  resolve,
  addNote,
}: {
  chat: null | ChatDocument;
  deleteChat: (id: string) => Promise<void>;
  resolve: (id: string) => Promise<void>;
  addNote: (id: string, note: string) => Promise<void>;
}) => {
  const [note, setNote] = useState("add note here....");
  const handleChange = useCallback((newValue: string) => setNote(newValue), []);

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
                max-width: 300px;
                position: relative;
                overflow: hidden;
                margin: 0;
                padding: 10px;
                border-radius: var(--p-border-radius-300);
                background: #EEF1F1;
            }

            .msgWrapper > p {
                margin-top: 5px;
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
                ? `${chat.customer.first_name} ${chat.customer.last_name}`
                : chat.email
                  ? chat.email
                  : "Anonymous"}
            </Text>
            <div className="hdrRigt">
              <Button
                icon={DeleteIcon}
                variant="tertiary"
                onClick={() => deleteChat(chat.id)}
                tone="critical"
              >
                Delete
              </Button>
              <Button
                icon={ReceiptRefundIcon}
                variant="primary"
                disabled={chat.status !== "open"}
                onClick={() => resolve(chat.id)}
              >
                Resolve{`${chat.status == "open" ? "" : "d"}`}
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
                icon={SendIcon}
                variant="primary"
                onClick={() => addNote(String(chat?.id || ""), note)}
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
