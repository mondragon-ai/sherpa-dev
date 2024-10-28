import { ChatDocument } from "app/lib/types/chats";
import { useCallback, useRef, useState } from "react";
import { getHoursDifference } from "app/lib/utils/converters/time";
import { Avatar, Badge, Select, Text, TextField } from "@shopify/polaris";
import { capitalizeWords, getInitials } from "app/lib/utils/converters/text";
import { EmailDocument } from "app/lib/types/emails";

const options = [
  { label: "Newest", value: "newest" },
  { label: "Opened", value: "open" },
  { label: "Action Required", value: "action_required" },
];

export const ChatList = ({
  chat_list,
  id,
  handleFetchChat,
  handleFilter,
}: {
  chat_list: ChatDocument[] | EmailDocument[];
  id: string;
  handleFetchChat: (id: string) => void;
  handleFilter: (query: "newest" | "open" | "action_required") => Promise<void>;
}) => {
  const [query, setQuery] = useState("");
  const [hasMore, setHasMore] = useState(
    chat_list.length && chat_list.length < 250 ? false : true,
  );
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState("newest");
  const [list, setList] = useState<(ChatDocument | EmailDocument)[]>([]);
  const observer = useRef<IntersectionObserver | null>(null);

  // Clear Query
  const handleClearButtonClick = useCallback(() => {
    setQuery("");

    console.log("cleared");
    // TODO: if clear revert to old chats
  }, [chat_list]);

  // Algolia Search
  const handleQuery = useCallback(
    (q: string) => {
      setQuery(q);
      console.log("Searching: " + q);

      // TODO: Query algolia
      // TODO: Update chats?

      if (q == "") {
        console.log("cleared");
        // TODO: if clear revert to old chats
      }
    },
    [chat_list],
  );

  // Fetch Filtered ChatsEmails
  const handleSelectChange = useCallback(
    async (value: "newest" | "open" | "action_required") => {
      await handleFilter(value);
      setSelected(value);
    },
    [],
  );

  // Fetch More Chats/Emails (infinity)
  const fetchMoreChats = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    console.log("LOADED MORE");
    setLoading(false);
  };

  // Last chat/email ref
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
    [loading, hasMore, chat_list],
  );

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
          {chat_list &&
            chat_list.map((chat, index) => {
              if (index === chat_list.length - 1) {
                return (
                  <div
                    key={index}
                    ref={lastChatRef}
                    onClick={() => handleFetchChat(chat.id)}
                  >
                    <ChatItem chat={chat} is_selected={id == chat.id} />
                  </div>
                );
              } else {
                return (
                  <div key={index} onClick={() => handleFetchChat(chat.id)}>
                    <ChatItem chat={chat} is_selected={id == chat.id} />
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

const ChatItem = ({
  chat,
  is_selected,
}: {
  chat: ChatDocument | EmailDocument;
  is_selected: boolean;
}) => {
  const name = chat.customer
    ? `${chat.customer.first_name} ${chat.customer.last_name}`
    : "A C";
  const initials = getInitials(name);

  return (
    <div
      className={"chatItem"}
      style={{
        background: is_selected
          ? "var(--p-color-bg-surface-tertiary-hover)"
          : "",
      }}
    >
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
              {capitalizeWords(chat.issue || "")}
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
          {capitalizeWords(chat.suggested_action || "")}
        </Text>
      </div>
    </div>
  );
};
