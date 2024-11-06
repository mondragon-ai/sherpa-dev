import { Text } from "@shopify/polaris";
import { Conversation } from "app/lib/types/shared";
import { getHoursDifference } from "app/lib/utils/converters/time";
import { marked } from "marked";

export const convertMarkdownToHtml = (markdown: string) => {
  return marked(markdown);
};

export const AgentChat = ({ chat }: { chat: Conversation }) => (
  <div className="msgWrapper" style={{ alignItems: "flex-end" }}>
    <div className="msg" style={{ background: "#D9E3F9" }}>
      <div
        dangerouslySetInnerHTML={{
          __html: convertMarkdownToHtml(chat.message),
        }}
      />
    </div>
    <Text variant="bodySm" as={"p"} tone="subdued">
      Agent - {getHoursDifference(chat.time)}
    </Text>
  </div>
);

export const CustomerChat = ({ chat }: { chat: Conversation }) => (
  <div className="msgWrapper">
    <div className="msg">
      <div
        dangerouslySetInnerHTML={{
          __html: convertMarkdownToHtml(chat.message),
        }}
      />
    </div>
    <Text variant="bodySm" as={"p"} tone="subdued">
      Customer - {getHoursDifference(chat.time)}
    </Text>
  </div>
);

export const Note = ({ chat }: { chat: Conversation }) => (
  <div className="msgWrapper" style={{ alignItems: "flex-end" }}>
    <div className="msg" style={{ background: "#F5E6A9" }}>
      <div
        dangerouslySetInnerHTML={{
          __html: convertMarkdownToHtml(chat.message),
        }}
      />
    </div>
    <Text variant="bodySm" as={"p"} tone="subdued">
      Note - {getHoursDifference(chat.time)}
    </Text>
  </div>
);

export const SuggestedEmail = ({ chat }: { chat: Conversation }) => (
  <div className="msgWrapper" style={{ alignItems: "flex-end" }}>
    <div className="msg" style={{ background: "#D9E3F9" }}>
      <div
        dangerouslySetInnerHTML={{
          __html: convertMarkdownToHtml(chat.message),
        }}
      />
    </div>
    <Text variant="bodySm" as={"p"} tone="subdued">
      Suggested Email - {getHoursDifference(chat.time)}
    </Text>
  </div>
);

export const Action = ({ chat }: { chat: Conversation }) => (
  <div className="actionText" style={{ margin: "1.2rem 0 2.5rem 0" }}>
    <Text variant="bodySm" as={"p"} tone="magic">
      {chat.action === "closed"
        ? `Chat closed ${getHoursDifference(chat.time)} ago.`
        : `Customer ${chat.action} the chat ${getHoursDifference(chat.time)} ago.`}
    </Text>
  </div>
);
