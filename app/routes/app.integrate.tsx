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
import { app_list, connected_apps } from "app/lib/data/integrate";
import { useCallback, useEffect, useState } from "react";

type ConnectedApps = {
  title: string;
  text: string;
  img: string;
  pending: boolean;
  connected: boolean;
};
export default function Integrate() {
  const [app, setApps] = useState<ConnectedApps[]>([]);
  const handleIntegrate = useCallback((app: string) => {
    console.log(app);
  }, []);

  useEffect(() => {
    setApps([]);

    const newApps: ConnectedApps[] = [];

    for (let a of app_list) {
      const matchingConnectedApp = connected_apps.find(
        (c) => c.title.toLocaleLowerCase() === a.title.toLocaleLowerCase(),
      );

      if (matchingConnectedApp) {
        const exists = newApps.some(
          (app) =>
            app.title.toLocaleLowerCase() ===
            matchingConnectedApp.title.toLocaleLowerCase(),
        );

        if (!exists) {
          newApps.push({
            title: matchingConnectedApp.title,
            text: a.text,
            img: a.img,
            pending: false,
            connected: matchingConnectedApp.connected,
          });
        }
      } else {
        const exists = newApps.some(
          (app) =>
            app.title.toLocaleLowerCase() === a.title.toLocaleLowerCase(),
        );

        if (!exists) {
          newApps.push({
            title: a.title,
            text: a.text,
            img: a.img,
            pending: false,
            connected: false,
          });
        }
      }
    }

    setApps((prev) => [...prev, ...newApps]);
  }, []);

  console.log(app);

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
                  {app &&
                    app.map((a) => {
                      return (
                        <App
                          title={a.title}
                          text={a.text}
                          img={a.img}
                          pending={a.pending}
                          connected={a.connected}
                          connect={handleIntegrate}
                        />
                      );
                    })}
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
  connect: (app: string) => void;
}

const App = ({ text, title, img, pending, connected, connect }: AppProps) => {
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
          <Button
            variant="primary"
            disabled={pending || connected}
            onClick={() => connect(title.toLocaleLowerCase())}
          >
            {pending ? "Coming" : "Connect"}
          </Button>
        </div>
      </Box>
    </Grid.Cell>
  );
};
