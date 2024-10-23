import {
  BlockStack,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Tabs,
  Text,
  TextField,
} from "@shopify/polaris";
import { useCallback, useState } from "react";
import { CodeAddIcon, DeleteIcon } from "@shopify/polaris-icons";
import { Accordion } from "../shared/Accordion";
import { capitalizeWords } from "app/lib/utils/converters/text";

type FaqType =
  | "cancelation"
  | "products"
  | "subscriptions"
  | "discounts"
  | "giveaway";

type ConfigType = {
  cancelation: {
    overview: string;
    faqs: { q: string; a: string }[];
  };
  products: {
    overview: string;
    faqs: { q: string; a: string }[];
  };
  subscriptions: {
    overview: string;
    faqs: { q: string; a: string }[];
  };
  discounts: {
    overview: string;
    faqs: { q: string; a: string }[];
  };
  giveaway: {
    overview: string;
    faqs: { q: string; a: string }[];
  };
};

const tabs = [
  {
    id: "cancelation",
    content: "Cancelation",
    accessibilityLabel: "Cancelation",
    panelID: "Cancelation",
  },
  {
    id: "products",
    content: "Products",
    panelID: "Products",
  },
  {
    id: "subscriptions",
    content: "Subscriptions",
    panelID: "Subscriptions",
  },
  {
    id: "discounts",
    content: "Discounts",
    panelID: "Discounts",
  },
  {
    id: "giveaway",
    content: "Giveaway",
    panelID: "Giveaway",
  },
];

export const Knowledge = () => {
  const [textFieldValue, setTextFieldValue] = useState("");
  const [config, setConfig] = useState<ConfigType>({
    cancelation: {
      overview: "",
      faqs: [],
    },
    products: {
      overview: "",
      faqs: [],
    },
    subscriptions: {
      overview: "",
      faqs: [],
    },
    discounts: {
      overview: "",
      faqs: [],
    },
    giveaway: {
      overview: "",
      faqs: [],
    },
  });
  const [checked, setChecked] = useState(false);
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex: number) => setSelected(selectedTabIndex),
    [],
  );

  const handleChange = useCallback(
    (newChecked: boolean) => setChecked(newChecked),
    [],
  );

  const handleTextFieldChange = useCallback(
    (value: string) => setTextFieldValue(value),
    [],
  );

  return (
    <>
      <style>
        {`

          .tabWrapper {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            height: auto;
            width: 100%;
            position: relative;
            margin: 10px 0;
            padding: 0px;
          }

          .tabWrapper > div > div:first-of-type {
            padding: 0px;
          }

      `}
      </style>
      <Grid columns={{ sm: 3 }}>
        <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 4, xl: 4 }}>
          <Box as="section">
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">
                FAQs
              </Text>
              <Text as="p" variant="bodyMd">
                The FAQ section provides answers to common questions and
                concerns related to you store, making it easy for customers to
                find quick solutions and guidance while customizing their app
                experience. Here is the guide:
              </Text>
            </BlockStack>
          </Box>
        </Grid.Cell>
        <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 8, xl: 8 }}>
          <Card roundedAbove="sm">
            <Text as="h2" variant="headingSm">
              Store Knowledge
            </Text>
            <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
              <Box paddingBlockStart="200">
                <FaqTabs type={tabs[selected].id as FaqType} configs={config} />
              </Box>
            </Tabs>
          </Card>
        </Grid.Cell>
      </Grid>
    </>
  );
};

const FaqTabs = ({ type, configs }: { type: FaqType; configs: ConfigType }) => {
  const { overview, faqs } = configs[type];
  const [textFieldValue, setTextFieldValue] = useState(overview);

  const handleTextFieldChange = useCallback(
    (value: string) => setTextFieldValue(value),
    [],
  );

  return (
    <BlockStack gap="200">
      <Box paddingBlockStart="500">
        <TextField
          label={`${capitalizeWords(type)} Overview`}
          value={textFieldValue}
          onChange={handleTextFieldChange}
          error=""
          type="text"
          multiline={4}
          autoComplete="off"
        />
      </Box>
      <Box paddingBlockStart="500">
        <Divider borderColor="border-inverse-hover" />
      </Box>
      <Box paddingBlockStart="200">
        <TextField
          label="FAQ Title"
          value={textFieldValue}
          onChange={handleTextFieldChange}
          error=""
          type="text"
          autoComplete="off"
        />
      </Box>
      <Box paddingBlockStart="200">
        <TextField
          label="FAQ Description"
          value={textFieldValue}
          onChange={handleTextFieldChange}
          error=""
          type="text"
          autoComplete="off"
        />
      </Box>

      <Box paddingBlockStart="200">
        <Button fullWidth variant="primary" icon={CodeAddIcon}>
          Add
        </Button>
      </Box>

      <Box paddingBlockStart="500">
        {faqs &&
          faqs.map((faq) => {
            return <Accordion title={faq.q} description={faq.a} />;
          })}
      </Box>
    </BlockStack>
  );
};
