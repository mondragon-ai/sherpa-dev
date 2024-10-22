import { Button, Icon, Text, TextField } from "@shopify/polaris";
import {
  OrderFulfilledIcon,
  ReceiptRefundIcon,
  NoteAddIcon,
} from "@shopify/polaris-icons";
import { getHoursDifference } from "app/lib/utils/converters/time";
import { useCallback, useState } from "react";

const initialChats = [
  {
    time: 1729606409,
    message: "",
    sender: "customer",
    is_note: false,
    action: "opened",
  },
  {
    time: 1729599209,
    message: "Hi, First Name, how can I help you?",
    sender: "agent",
    is_note: false,
    action: null,
  },
  {
    time: 1729602809,
    message: "Yea my shit is FUCKED",
    sender: "customer",
    is_note: false,
    action: null,
  },
  {
    time: 1729606409,
    message: "Fuck dude, what happened?",
    sender: "agent",
    is_note: false,
    action: null,
  },
  {
    time: 1729602809,
    message: "Yea my shit is FUCKED",
    sender: "customer",
    is_note: false,
    action: null,
  },
  {
    time: 1729606409,
    message: "Fuck dude, what happened?",
    sender: "agent",
    is_note: false,
    action: null,
  },
  {
    time: 1729602809,
    message: "Yea my shit is FUCKED",
    sender: "customer",
    is_note: false,
    action: null,
  },
  {
    time: 1729606409,
    message: "Fuck dude, what happened?",
    sender: "agent",
    is_note: false,
    action: null,
  },
  {
    time: 1729606409,
    message: "",
    sender: "agent",
    is_note: false,
    action: "closed",
  },
  {
    time: 1729606409,
    message: "Homie rly just needed a friend",
    sender: "agent",
    is_note: true,
    action: null,
  },
] as Chat[];

interface Chat {
  time: number;
  is_note: boolean;
  message: string;
  sender: "agent" | "customer";
  action: null | "closed" | "opened";
}

export const Chat = () => {
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [value, setValue] = useState("1776 Barnes Street\nOrlando, FL 32801");

  const handleChange = useCallback(
    (newValue: string) => setValue(newValue),
    [],
  );

  return (
    <>
      <style>{`
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

            `}</style>

      <div className={"chatWrapper"}>
        <header>
          <Text variant="headingLg" as={"strong"}>
            {true ? "First Last Name" : "email@gmail"}
          </Text>
          <div className="hdrRigt">
            <Button icon={ReceiptRefundIcon} variant="tertiary" disabled>
              Resolve
            </Button>
            <Button icon={OrderFulfilledIcon} variant="primary" disabled>
              Close
            </Button>
          </div>
        </header>

        <div className={"convoWrapper"}>
          {chats.map((chat, index) => {
            if (chat.sender == "agent" && !chat.action && !chat.is_note) {
              return <AgentChat chat={chat} />;
            }

            if (chat.sender == "customer" && !chat.action && !chat.is_note) {
              return <CustomerChat chat={chat} />;
            }

            if (chat.action) {
              return <Action chat={chat} />;
            }

            if (chat.is_note) {
              return <Note chat={chat} />;
            }
          })}
          {loading && <div>Loading more chats...</div>}
        </div>
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
                value={value}
                onChange={handleChange}
                multiline={4}
                autoComplete="off"
              />
            </div>
            <div className="txtContainerFooter">
              <Button icon={OrderFulfilledIcon} variant="primary" disabled>
                Submit
              </Button>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

const Action = ({ chat }: { chat: Chat }) => {
  return (
    <div className="actionText">
      {chat.action == "closed" ? (
        <Text variant="bodySm" as={"p"} tone="magic">
          Chat {chat.action} {getHoursDifference(chat.time)} ago.{" "}
        </Text>
      ) : (
        <Text variant="bodySm" as={"p"} tone="magic">
          Customer {chat.action} a chat {getHoursDifference(chat.time)} ago.{" "}
        </Text>
      )}
    </div>
  );
};

const Note = ({ chat }: { chat: Chat }) => {
  return (
    <div className="msgWrapper" style={{ alignItems: "flex-end" }}>
      <div className="msg" style={{ background: "#F5E6A9" }}>
        {chat.message}
      </div>
      <Text variant="bodySm" as={"p"} tone="subdued">
        {chat.is_note ? "Note" : chat.sender} - {getHoursDifference(chat.time)}
      </Text>
    </div>
  );
};

const AgentChat = ({ chat }: { chat: Chat }) => {
  return (
    <div className="msgWrapper" style={{ alignItems: "flex-end" }}>
      <div className="msg" style={{ background: "#D9E3F9" }}>
        {chat.message}
      </div>
      <Text variant="bodySm" as={"p"} tone="subdued">
        {chat.is_note ? "Note" : chat.sender} - {getHoursDifference(chat.time)}
      </Text>
    </div>
  );
};

const CustomerChat = ({ chat }: { chat: Chat }) => {
  return (
    <div className="msgWrapper">
      <div className="msg">{chat.message}</div>
      <Text variant="bodySm" as={"p"} tone="subdued">
        {chat.sender} - {getHoursDifference(chat.time)}
      </Text>
    </div>
  );
};