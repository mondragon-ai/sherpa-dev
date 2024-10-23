import { Conversation } from "app/lib/types/chats";
import { Text } from "@shopify/polaris";
import { getHoursDifference } from "app/lib/utils/converters/time";

export const AgentChat = ({ chat }: { chat: Conversation }) => (
  <div className="msgWrapper" style={{ alignItems: "flex-end" }}>
    <div className="msg" style={{ background: "#D9E3F9" }}>
      {chat.message}
    </div>
    <Text variant="bodySm" as={"p"} tone="subdued">
      Agent - {getHoursDifference(chat.time)}
    </Text>
  </div>
);

export const CustomerChat = ({ chat }: { chat: Conversation }) => (
  <div className="msgWrapper">
    <div className="msg">{chat.message}</div>
    <Text variant="bodySm" as={"p"} tone="subdued">
      Customer - {getHoursDifference(chat.time)}
    </Text>
  </div>
);

export const Note = ({ chat }: { chat: Conversation }) => (
  <div className="msgWrapper" style={{ alignItems: "flex-end" }}>
    <div className="msg" style={{ background: "#F5E6A9" }}>
      {chat.message}
    </div>
    <Text variant="bodySm" as={"p"} tone="subdued">
      Note - {getHoursDifference(chat.time)}
    </Text>
  </div>
);

export const Action = ({ chat }: { chat: Conversation }) => (
  <div className="actionText">
    <Text variant="bodySm" as={"p"} tone="magic">
      {chat.action === "closed"
        ? `Chat closed ${getHoursDifference(chat.time)} ago.`
        : `Customer ${chat.action} the chat ${getHoursDifference(chat.time)} ago.`}
    </Text>
  </div>
);
