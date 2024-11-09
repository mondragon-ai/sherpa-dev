import {
  Page,
  BlockStack,
  Box,
  Grid,
  Text,
  Card,
  TextField,
  Button,
  Image,
} from "@shopify/polaris";
import { useLoaderData } from "@remix-run/react";
import { useIntegrate } from "app/lib/hooks/useIntegrate";
import { integrationLoader } from "./loaders/integration";
import { IntegrationAction } from "./actions/Integration";
import { useEffect, useState } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";

export const loader = integrationLoader;
export const action = IntegrationAction;

export default function Integrate() {
  const shopify = useAppBridge();
  const data = useLoaderData<typeof loader>();
  const {
    apps,
    error,
    isLoading,
    setApps,
    setError,
    handleRecahrgeSave,
    handleRecahrgeRemove,
    handleLinkGmail,
    handleGmailRemove,
  } = useIntegrate();

  useEffect(() => {
    if (data && !apps) {
      setApps(data.apps as any);
      shopify.toast.show(data.message);
    }
  }, [data, shopify]);

  const gmail = apps ? apps.find((a) => a.name == "gmail") : null;
  const recharge = apps ? apps.find((a) => a.name == "recharge") : null;

  console.log(apps);
  return (
    <Page title="Integration">
      <BlockStack gap={"300"}>
        {/* APPS */}
        <Grid columns={{ sm: 3 }}>
          <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 4, xl: 4 }}>
            <Box as="section">
              <BlockStack gap="400">
                <Text as="h3" variant="headingMd">
                  Connect Apps
                </Text>
                <Text as="p" variant="bodyMd">
                  Easily connect your customer service email and other 3rd party
                  apps to make automation and customer support effortless.
                </Text>
              </BlockStack>
            </Box>
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 8, xl: 8 }}>
            <Card roundedAbove="sm">
              <BlockStack gap="400">
                <Text as="h2" variant="headingSm">
                  3rd Party Apps
                </Text>
                <Grid columns={{ sm: 3 }}>
                  <App
                    isLoading={isLoading}
                    title={"Gmail"}
                    text={
                      "Connect your customer service inbox to Sherpa for auto-completion"
                    }
                    img={
                      "https://static.vecteezy.com/system/resources/previews/020/964/377/non_2x/gmail-mail-icon-for-web-design-free-png.png"
                    }
                    pending={false}
                    connected={gmail ? gmail?.connected : false}
                    connect={handleLinkGmail}
                    remove={handleGmailRemove}
                  />
                  <App
                    isLoading={isLoading}
                    title={"Outlook"}
                    text={
                      "Connect your customer service inbox to Sherpa for auto-completion"
                    }
                    img={
                      "https://cdn3.iconfinder.com/data/icons/social-media-logos-flat-colorful-1/2048/5382_-_Outlook-512.png"
                    }
                    pending={true}
                    connected={false}
                    connect={() => {}}
                    remove={handleRecahrgeRemove}
                  />
                  <App
                    isLoading={isLoading}
                    title={"Stripe"}
                    text={
                      "Subscription can be searched and modified via Sherpa"
                    }
                    img={
                      "https://cdn.iconscout.com/icon/free/png-256/free-stripe-logo-icon-download-in-svg-png-gif-file-formats--flat-social-media-branding-pack-logos-icons-498440.png?f=webp&w=256"
                    }
                    pending={true}
                    connected={false}
                    connect={() => {}}
                    remove={handleRecahrgeRemove}
                  />
                  <App
                    isLoading={isLoading}
                    title={"Recharge"}
                    text={
                      "Subscription can be searched and modified via Sherpa"
                    }
                    img={
                      "https://d3fmzy9bmh9dam.cloudfront.net/wp-content/uploads/2022/02/11.svg"
                    }
                    pending={false}
                    token={recharge ? recharge?.token : ""}
                    connected={recharge ? recharge?.connected : false}
                    connect={handleRecahrgeSave}
                    remove={handleRecahrgeRemove}
                  />
                </Grid>
              </BlockStack>
            </Card>
          </Grid.Cell>
        </Grid>

        <Box paddingBlockStart="200"></Box>
      </BlockStack>
    </Page>
  );
}

interface AppProps {
  title: string;
  text: string;
  img: string;
  pending: boolean;
  connected: boolean;
  connect: (v: string) => void;
  remove: () => void;
  token?: string;
  isLoading: boolean;
}

const App = ({
  text,
  title,
  img,
  pending,
  connected,
  token,
  isLoading,
  connect,
  remove,
}: AppProps) => {
  const [v, setV] = useState(token || "");
  return (
    <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 4, xl: 4 }}>
      <Box
        as="section"
        borderStyle="solid"
        borderWidth="025"
        borderColor="border-tertiary"
        borderRadius="100"
        padding="150"
        paddingBlockEnd="300"
        paddingBlockStart="300"
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Image alt={"gmail"} source={img} height={70} width={70} />
          <Text as="h2" variant="headingSm">
            {title}
          </Text>
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              margin: "10px 0 20px 0",
            }}
          >
            <Text as="p" variant="bodyMd" alignment="center">
              {text}
            </Text>
          </div>
          {title == "Recharge" && (token == "" || !token) ? (
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                margin: "10px 0 20px 0",
              }}
            >
              <TextField
                label="Access Token"
                placeholder="shp_at_123..."
                value={v}
                onChange={setV}
                error=""
                type="text"
                autoComplete="off"
              />
            </div>
          ) : null}
          {!connected ? (
            <Button
              loading={isLoading}
              variant="primary"
              disabled={pending || connected}
              onClick={() => connect(v)}
            >
              {pending ? "Coming Soon" : "Connect"}
            </Button>
          ) : (
            <Button
              loading={isLoading}
              variant="primary"
              disabled={!connected}
              onClick={() => remove()}
            >
              Remove App
            </Button>
          )}
        </div>
      </Box>
    </Grid.Cell>
  );
};
