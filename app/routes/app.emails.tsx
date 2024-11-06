import { useEffect, useState } from "react";
import { Page, Grid, Banner, Text } from "@shopify/polaris";
import { emailsLoader } from "./loaders/emails";
import { Chat } from "app/components/home/Chat";
import { useLoaderData } from "@remix-run/react";
import { ChatDocument } from "app/lib/types/chats";
import { useEmails } from "app/lib/hooks/useEmails";
import { ChatList } from "app/components/home/ChatList";
import { useAppBridge } from "@shopify/app-bridge-react";
import { ChatDetail } from "app/components/home/ChatDetail";
import { EmailDocument } from "app/lib/types/emails";
import { emailAction } from "./actions/email";

export const loader = emailsLoader;
export const action = emailAction;

export default function Emails() {
  const shopify = useAppBridge();
  const data = useLoaderData<typeof loader>();
  const [fetching, setFetch] = useState(true);
  const {
    email,
    emails,
    error,
    isLoading,
    setEmails,
    setError,
    handleFilter,
    handleAddNote,
    handleResolve,
    handleFetchEmail,
    handleDeleteEmail,
    handleRequestEmail,
    handleFetchNext,
  } = useEmails();

  useEffect(() => {
    if (data && fetching) {
      setEmails(data.emails as unknown as EmailDocument[]);
      shopify.toast.show(data.message);
      setFetch(false);
    }
  }, [data, shopify]);

  return (
    <Page
      fullWidth
      title="Customer Emails"
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
      <Grid columns={{ sm: 3 }}>
        <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 3, xl: 3 }}>
          <Placeholder>
            <ChatList
              handleFetchNext={handleFetchNext}
              handleRequestChat={handleRequestEmail}
              domain={data.shop}
              type="email"
              chat_list={emails}
              id={email ? email.id : ""}
              handleFilter={handleFilter}
              handleFetchChat={handleFetchEmail}
            />
          </Placeholder>
        </Grid.Cell>
        <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 6, xl: 6 }}>
          <Placeholder>
            <Chat
              chat={email}
              resolve={handleResolve}
              addNote={handleAddNote}
              deleteChat={handleDeleteEmail}
            />
          </Placeholder>
        </Grid.Cell>
        <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 3, xl: 3 }}>
          <Placeholder>
            <ChatDetail chat={email} />
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
