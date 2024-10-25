import { useEffect, useState } from "react";
import { chatAction } from "./actions/chat";
import { chatsLoader } from "./loaders/chats";
import { Chat } from "app/components/home/Chat";
import { useLoaderData } from "@remix-run/react";
import { useChats } from "app/lib/hooks/useChats";
import { ChatDocument } from "app/lib/types/chats";
import { ChatList } from "app/components/home/ChatList";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Page, Grid, Banner, Text, Box } from "@shopify/polaris";
import { ChatDetail } from "app/components/home/ChatDetail";

export const loader = chatsLoader;
export const action = chatAction;

export default function Index() {
  const shopify = useAppBridge();
  const data = useLoaderData<typeof loader>();
  const [fetching, setFetch] = useState(true);
  const {
    chat,
    chats,
    error,
    isLoading,
    setError,
    setChats,
    setChat,
    handleResolve,
    handleAddNote,
    handleDeleteChat,
    handleFetchChat,
  } = useChats();

  useEffect(() => {
    if (data && fetching) {
      setChats(data.chats as unknown as ChatDocument[]);
      shopify.toast.show(data.message);
      setFetch(false);
    }
  }, [data, shopify]);

  return (
    <Page
      fullWidth
      title="Customer Chats"
      subtitle="Last Updated: Oct 21, 24 2:00 PM"
    >
      {error.message && (
        <Banner
          onDismiss={() => setError({ message: "", type: "" })}
          tone="critical"
        >
          <Text as="p" variant="bodyMd">
            {error.message}
          </Text>
        </Banner>
      )}
      <Box paddingBlockStart="300"></Box>
      <Grid columns={{ sm: 3 }}>
        <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 3, xl: 3 }}>
          <Placeholder>
            <ChatList
              chat_list={chats}
              id={chat ? chat.id : ""}
              handleFetchChat={handleFetchChat}
            />
          </Placeholder>
        </Grid.Cell>
        <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 6, xl: 6 }}>
          <Placeholder>
            <Chat
              chat={chat}
              deleteChat={handleDeleteChat}
              resolve={handleResolve}
              addNote={handleAddNote}
            />
          </Placeholder>
        </Grid.Cell>
        <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 3, xl: 3 }}>
          <Placeholder>
            <ChatDetail chat={chat} />
          </Placeholder>
        </Grid.Cell>
      </Grid>
    </Page>
  );
}

const Placeholder = ({ children }: { children: JSX.Element }) => {
  return (
    <>
      <style>{`
        .homeCardWrapper {
          height: 85vh;
          width: 100%;
          position: relative;
          margin: 0;
          padding: 0;
          background: var(--p-color-bg-surface);
          border-radius: var(--p-border-radius-300);
          box-shadow: var(--p-shadow-100);
        }
      `}</style>
      <div className={"homeCardWrapper"}>{children}</div>
    </>
  );
};
