// import styles from "./Home.module.css";
import { ChatDocument } from "app/lib/types/chats";
import { useCallback, useRef, useState } from "react";
import { getHoursDifference } from "app/lib/utils/converters/time";
import { Avatar, Badge, Select, Text, TextField } from "@shopify/polaris";
import { capitalizeWords, getInitials } from "app/lib/utils/converters/text";

export const ChatList = ({
  chat_list,
  handleFetchChat,
}: {
  chat_list: ChatDocument[];
  handleFetchChat: (id: string) => void;
}) => {
  const [chats, setChats] = useState<ChatDocument[]>(chat_list);
  const [selected, setSelected] = useState("newest");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const handleSelectChange = useCallback((value: string) => {
    console.log(value);

    // fetch filtered chats

    // set chats
    setSelected(value);
  }, []);

  const options = [
    { label: "Newest", value: "newest" },
    { label: "Opened", value: "opened" },
  ];

  const fetchMoreChats = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    console.log("LOADED MORE");

    // * Simulating an API fetch call
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

  const handleQuery = useCallback((q: string) => {
    setQuery(q);

    // TODO: Query algolia
    // TODO: Update chats?

    // TODO: if clear revert to old chats
  }, []);

  const handleClearButtonClick = useCallback(() => setQuery(""), []);

  return (
    <>
      <style>
        {`
            .listContainer {
                height: 100%;
                width: 100%;
                position: relative;
                margin: 0;
                padding: 0.5rem 10px;
            }
            
            .listWrapperHdr {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                height: 100px;
                width: 100%;
                position: relative;
                margin: 0;
                padding: 10px;
                z-index: 5;
                background: white;
            }
            
            .chatTopHdr {
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: auto;
                width: 100%;
                position: relative;
                margin: 0;
                padding: 0px;
                margin-bottom: 10px;
            }
            .chatTopHdr > div {
                width: 100% !important;
            }
            
            .chatBtmHdr {
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: auto;
                width: 100%;
                position: relative;
                margin: 0;
                padding: 0px;
                padding-bottom: 10px;
            }
            
            .chatsHdrRight {
                display: flex;
                justify-content: flex-end;
                align-items: center;
                height: auto;
                width: auto;
                position: relative;
                margin: 0;
                padding: 0;
                cursor: pointer;
            }
            
            .chatsHdrRight:hover {
                color: var(--p-color-bg-surface-tertiary-hover);
            }
            
            .listWrapper {
                height: calc(100% - 80px);
                width: 100%;
                position: relative;
                margin: 0;
                padding: 0;
                overflow-y: scroll;
            }
            
            .chatItem {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: flex-start;
                min-height: 75px;
                height: auto;
                width: 100%;
                position: relative;
                margin: 0;
                margin-bottom: 10px;
                padding: 10px;
                border-radius: var(--p-border-radius-300);
                cursor: pointer;
                background: #eef1f140;
            }
            
            .chatItem:hover {
                background: var(--p-color-bg-surface-tertiary-hover);
            }
            
            .chatItem .chatTxt {
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: flex-start;
                height: auto;
                width: 100%;
                position: relative;
                margin: 0;
                padding: 0px;
                padding-left: 10px;
            }
            
            .chatItem .chatTxt > header {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                height: auto;
                width: 100%;
                position: relative;
                margin: 0;
                padding: 0px;
                margin-bottom: 5px;
            }
            
            .chatItem .chatTxt > header > div {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
                height: auto;
                width: 100%;
                position: relative;
                margin: 0;
                padding: 0px;
            }
            
            .chatItem .chatTxt > header > div > span {
                margin-right: 5px;
            }
            
            .chatItem .chatTxt > p:first-of-type {
                margin: 5px 0;
            }
        `}
      </style>

      <div className={"listContainer"}>
        <header className={"listWrapperHdr"}>
          <div className={"chatTopHdr"}>
            <TextField
              size="medium"
              label=""
              prefix="🔎"
              type="search"
              value={query}
              onChange={(v) => handleQuery(v)}
              clearButton
              onClearButtonClick={handleClearButtonClick}
              //   loading
              selectTextOnFocus={false}
              autoComplete="off"
            />
          </div>
          <div className={"chatBtmHdr"}>
            <Text variant="bodyLg" as={"strong"}>
              {capitalizeWords(selected)}
            </Text>
            <div className={"chatsHdrRight"}>
              <Select
                label="Sort by"
                labelInline
                options={options}
                onChange={handleSelectChange}
                value={selected}
              />
            </div>
          </div>
        </header>

        <div className={"listWrapper"}>
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
    </>
  );
};

const ChatItem: React.FC<{ chat: ChatDocument }> = ({ chat }) => {
  const name = chat.customer
    ? `${chat.customer.first_name} ${chat.customer.last_name}`
    : "AC";
  const initials = getInitials(name);

  return (
    <div className={"chatItem"}>
      <Avatar initials={initials} name={name} />
      <div className={"chatTxt"}>
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
