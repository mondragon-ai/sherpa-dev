import styles from "./Home.module.css";
import { ChatDocument } from "app/lib/types/chats";
import { useCallback, useRef, useState } from "react";
import { ArrowDownIcon } from "@shopify/polaris-icons";
import { getHoursDifference } from "app/lib/utils/converters/time";
import { Avatar, Badge, Icon, Text, TextField } from "@shopify/polaris";
import { capitalizeWords, getInitials } from "app/lib/utils/converters/text";

export const ChatList = ({
  chat_list,
  handleFetchChat,
}: {
  chat_list: ChatDocument[];
  handleFetchChat: (id: string) => void;
}) => {
  const [chats, setChats] = useState<ChatDocument[]>(chat_list);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchMoreChats = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    console.log("LOADED MORE");

    // // Simulating an API fetch call
    // const newChats = await fetch('/api/chats?cursor=' + chats[chats.length - 1].id)
    //   .then(res => res.json())
    //   .catch(() => []);

    // if (newChats.length > 0) {
    //   setChats(prevChats => [...prevChats, ...newChats]);
    // } else {
    //   setHasMore(false); // If no more chats are available
    // }

    setLoading(false);
  };

  const lastChatRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchMoreChats();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  return (
    <div className={styles.listContainer}>
      <header className={styles.listWrapperHdr}>
        <div className={styles.chatTopHdr}>
          <TextField
            size="medium"
            label=""
            prefix="🔎"
            type="search"
            value={"1123123"}
            onChange={() => {}}
            clearButton
            loading
            selectTextOnFocus={false}
            autoComplete="off"
          />
        </div>
        <div className={styles.chatBtmHdr}>
          <Text variant="bodyLg" as={"strong"}>
            Open
          </Text>
          <div className={styles.chatsHdrRight}>
            <Text variant="bodyLg" as={"strong"}>
              Open
            </Text>
            <Icon source={ArrowDownIcon} />
          </div>
        </div>
      </header>

      <div className={styles.listWrapper}>
        {chats.map((chat, index) => {
          if (index === chats.length - 1) {
            return (
              <div
                key={index}
                ref={lastChatRef}
                onClick={() => handleFetchChat(chat.id)}
              >
                <ChatItem chat={chat} />
              </div>
            );
          } else {
            return (
              <div key={index} onClick={() => handleFetchChat(chat.id)}>
                <ChatItem chat={chat} />
              </div>
            );
          }
        })}
        {loading && <div>Loading more chats...</div>}
      </div>
    </div>
  );
};

const ChatItem: React.FC<{ chat: ChatDocument }> = ({ chat }) => {
  const name = chat.customer
    ? `${chat.customer.first_name} ${chat.customer.last_name}`
    : "AC";
  const initials = getInitials(name);

  return (
    <div className={styles.chatItem}>
      <Avatar initials={initials} name={name} />
      <div className={styles.chatTxt}>
        <header>
          <div>
            <Badge
              tone={chat.status == "open" ? "warning" : "success"}
              size="small"
              progress={
                chat.status == "open" ? "partiallyComplete" : "complete"
              }
            >
              {capitalizeWords(chat.status)}
            </Badge>

            <Text variant="bodySm" as={"p"} tone="base" truncate>
              {capitalizeWords(chat.issue)}
            </Text>
          </div>

          <Text variant="bodySm" as={"p"} tone="subdued">
            {getHoursDifference(chat.time)}
          </Text>
        </header>

        <Text variant="bodySm" as={"p"} tone="base" truncate>
          {chat.email ? chat.email : "Anonymous"}
        </Text>

        <Text variant="bodySm" as={"p"} tone="subdued" truncate>
          {capitalizeWords(chat.suggested_action)}
        </Text>
      </div>
    </div>
  );
};
