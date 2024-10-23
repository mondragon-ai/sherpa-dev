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
import { useCallback } from "react";

const app_list = [
  {
    title: "Gmail",
    text: "Connect your customer service inbox to Sherpa for auto-completion",
    img: "https://static.vecteezy.com/system/resources/previews/020/964/377/non_2x/gmail-mail-icon-for-web-design-free-png.png",
    pending: false,
  },
  {
    title: "Stripe",
    text: "Subscription can be searched and modified via Sherpa",
    img: "https://cdn.iconscout.com/icon/free/png-256/free-stripe-logo-icon-download-in-svg-png-gif-file-formats--flat-social-media-branding-pack-logos-icons-498440.png?f=webp&w=256",
    pending: true,
  },
  {
    title: "Recharge",
    text: "Subscription can be searched and modified via Sherpa",
    img: "https://d3fmzy9bmh9dam.cloudfront.net/wp-content/uploads/2022/02/11.svg",
    pending: true,
  },
  {
    title: "Outlook",
    text: "Connect your customer service inbox to Sherpa for auto-completion",
    img: "https://cdn3.iconfinder.com/data/icons/social-media-logos-flat-colorful-1/2048/5382_-_Outlook-512.png",
    pending: true,
  },
];

export default function Integrate() {
  const handleIntegrate = useCallback((app: string) => {
    console.log(app);
  }, []);
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
                  {app_list &&
                    app_list.map((a) => {
                      return (
                        <App
                          title={a.title}
                          text={a.text}
                          img={a.img}
                          pending={a.pending}
                          connected={false}
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
