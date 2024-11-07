import { Image, Text } from "@shopify/polaris";
import { Conversation, EmailConversation } from "app/lib/types/shared";
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

export const CustomerChat = ({ chat }: { chat: EmailConversation }) => (
  <div className="msgWrapper">
    <div className="msg">
      <div
        dangerouslySetInnerHTML={{
          __html: convertMarkdownToHtml(chat.message),
        }}
      />
    </div>

    {chat.attachments && chat.attachments.length
      ? chat.attachments.map((i) => {
          if (i == "") return null;
          return (
            <div className="img-msg">
              <Image alt={"attachment"} source={i} />
            </div>
          );
        })
      : null}
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

export const SuggestedEmail = ({
  chat,
  onCick,
}: {
  chat: Conversation;
  onCick: (id: string) => void;
}) => (
  <div
    onClick={() => onCick(`${chat.time}`)}
    className="msgWrapper"
    style={{ alignItems: "flex-end", cursor: "pointer" }}
  >
    <div className="msg" style={{ background: "#e3cfff" }}>
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
