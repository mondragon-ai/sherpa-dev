import { useCallback, useRef, useState } from "react";
import { ArrowDownIcon } from "@shopify/polaris-icons";
import { Icon, Text, TextField } from "@shopify/polaris";

const initialChats = [
  { id: 1, message: "Hello!", sender: "User1" },
  { id: 2, message: "Hi there!", sender: "User2" },
  { id: 1, message: "Hello!", sender: "User1" },
  { id: 2, message: "Hi there!", sender: "User2" },
  { id: 1, message: "Hello!", sender: "User1" },
  { id: 2, message: "Hi there!", sender: "User2" },
  { id: 1, message: "Hello!", sender: "User1" },
  { id: 2, message: "Hi there!", sender: "User2" },
  { id: 1, message: "Hello!", sender: "User1" },
  { id: 2, message: "Hi there!", sender: "User2" },
  { id: 1, message: "Hello!", sender: "User1" },
  { id: 2, message: "Hi there!", sender: "User2" },
  { id: 1, message: "Hello!", sender: "User1" },
  { id: 2, message: "Hi there!", sender: "User2" },
  { id: 1, message: "Hello!", sender: "User1" },
  { id: 2, message: "Hi there!", sender: "User2" },
  { id: 1, message: "Hello!", sender: "User1" },
  { id: 2, message: "Hi there!", sender: "User2" },
  { id: 1, message: "Hello!", sender: "User1" },
  { id: 2, message: "Hi there!", sender: "User2" },
  { id: 1, message: "Hello!", sender: "User1" },
  { id: 2, message: "Hi there!", sender: "User2" },
  { id: 1, message: "Hello!", sender: "User1" },
  { id: 2, message: "Hi there!", sender: "User2" },
  { id: 1, message: "Hello!", sender: "User1" },
  { id: 2, message: "Hi there!", sender: "User2" },
  { id: 1, message: "Hello!", sender: "User1" },
  { id: 2, message: "Hi there!", sender: "User2" },
  { id: 1, message: "Hello!", sender: "User1" },
  { id: 2, message: "Hi there!", sender: "User2" },
  { id: 1, message: "Hello!", sender: "User1" },
  { id: 2, message: "Hi there!", sender: "User2" },
  { id: 1, message: "Hello!", sender: "User1" },
  { id: 2, message: "Hi there!", sender: "User2" },
  { id: 1, message: "Hello!", sender: "User1" },
  { id: 2, message: "Hi there!", sender: "User2" },
  { id: 1, message: "Hello!", sender: "User1" },
  { id: 2, message: "Hi there!", sender: "User2" },
  { id: 1, message: "Hello!", sender: "User1" },
  { id: 2, message: "Hi there!", sender: "User2" },
  { id: 1, message: "Hello!", sender: "User1" },
  { id: 2, message: "Hi there!", sender: "User2" },
  { id: 1, message: "Hello!", sender: "User1" },
  { id: 2, message: "Hi there!", sender: "User2" },
  { id: 1, message: "Hello!", sender: "User1" },
  { id: 2, message: "Hi there!", sender: "User2" },
  { id: 1, message: "Hello!", sender: "User1" },
  { id: 2, message: "Hi there!", sender: "User2" },
  { id: 1, message: "Hello!", sender: "User1" },
  { id: 2, message: "Hi there!", sender: "User2" },
  { id: 1, message: "Hello!", sender: "User1" },
  { id: 2, message: "Hi there!", sender: "User2" },
  { id: 1, message: "Hello!", sender: "User1" },
  { id: 2, message: "Hi there!", sender: "User2" },
  { id: 1, message: "Hello!", sender: "User1" },
  { id: 2, message: "Hi there!", sender: "User2" },
];

interface Chat {
  id: number;
  message: string;
  sender: string;
}

export const ChatList = () => {
  const [chats, setChats] = useState<Chat[]>(initialChats);
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
    <>
      <style>{`


        .listWrapperHdr {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            height: 80px;
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

        .listContainer {
            height: 85vh;
            width: 100%;
            position: relative;
            margin: 0;
            padding: 0.5rem 10px;
        }

        .listWrapper {
            height: 87%;
            width: 100%;
            position: relative;
            margin: 0;
            padding: 0;
            overflow-y: scroll;
        }


        .footerWrapper {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            height: 8%;
            width: 100%;
            position: relative;
            margin: 0;
            padding: 10px;
        }

        .chatItem {
            min-height: 75px;
            height: auto;
            width: 100%;
            position: relative;
            margin: 0;
            margin-bottom: 10px;
            padding: 10px;
            border-radius: var(--p-border-radius-300);
            background: var(--p-color-bg-surface-tertiary-hover);
            cursor: pointer;
        }
        `}</style>
      <div className={"listContainer"}>
        <header className={"listWrapperHdr"}>
          <div className="chatTopHdr">
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
              //   connectedRight={<Button>Search</Button>}
            />
          </div>
          <div className="chatBtmHdr">
            <Text variant="bodyLg" as={"strong"}>
              Open
            </Text>
            <div className={"chatsHdrRight"}>
              <Text variant="bodyLg" as={"strong"}>
                Open
              </Text>
              <Icon source={ArrowDownIcon} />
            </div>
          </div>
        </header>

        <div className={"listWrapper"}>
          {chats.map((chat, index) => {
            if (index === chats.length - 1) {
              return (
                <div key={index} ref={lastChatRef}>
                  <ChatItem chat={chat} />
                </div>
              );
            } else {
              return <ChatItem key={index} chat={chat} />;
            }
          })}
          {loading && <div>Loading more chats...</div>}
        </div>

        {/* {<footer className="footerWrapper">Footer</footer>} */}
      </div>
    </>
  );
};

const ChatItem: React.FC<{ chat: Chat }> = ({ chat }) => {
  return (
    <div className={"chatItem"}>
      <strong>{chat.sender}:</strong> {chat.message}
    </div>
  );
};
