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
import { Accordion } from "../shared/Accordion";
import { CodeAddIcon } from "@shopify/polaris-icons";
import { capitalizeWords } from "app/lib/utils/converters/text";
import { ConfigurationsType, FAQTypeNames } from "app/lib/types/config";
import { Dispatch, SetStateAction, useCallback, useState } from "react";

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

export const Knowledge = ({
  config,
  setConfig,
}: {
  config: ConfigurationsType;
  setConfig: Dispatch<SetStateAction<ConfigurationsType>>;
}) => {
  const [selected, setSelected] = useState(0);
  const handleTabChange = useCallback(
    (selectedTabIndex: number) => setSelected(selectedTabIndex),
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
                Knowledge Base
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
                <FaqTabs
                  type={tabs[selected].id as FAQTypeNames}
                  configs={config}
                  setConfig={setConfig}
                />
              </Box>
            </Tabs>
          </Card>
        </Grid.Cell>
      </Grid>
    </>
  );
};

const FaqTabs = ({
  type,
  configs,
  setConfig,
}: {
  type: FAQTypeNames;
  configs: ConfigurationsType;
  setConfig: Dispatch<SetStateAction<ConfigurationsType>>;
}) => {
  const [faq, setFaq] = useState({ q: "", a: "" });
  const handleOverviewTxt = useCallback(
    (v: string) =>
      setConfig((p) => ({ ...p, [type]: { ...p[type], overview: v } })),
    [],
  );

  console.log({ type, config_type: configs[type] });

  const handleAddSpecialCase = useCallback(() => {
    setConfig((p) => ({
      ...p,
      [type]: { ...p[type], faqs: [...p[type].faqs, faq] },
    }));
    setFaq({ q: "", a: "" });
  }, [faq, configs]);

  const handleDeleteSpecialCase = useCallback(
    (a: string) => {
      const faqs = configs[type].faqs.filter((s) => s.a !== a);
      setConfig((p) => ({ ...p, [type]: { ...p[type], faqs: faqs } }));
    },
    [faq, configs],
  );

  return (
    <BlockStack gap="200">
      <Box paddingBlockStart="500">
        <TextField
          label={`${capitalizeWords(type)} Overview`}
          value={configs[type].overview}
          onChange={handleOverviewTxt}
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
          label={`${capitalizeWords(type)} FAQ Question`}
          value={faq.q}
          onChange={(v) => setFaq((p) => ({ ...p, q: v }))}
          error=""
          type="text"
          autoComplete="off"
        />
      </Box>
      <Box paddingBlockStart="200">
        <TextField
          label={`${capitalizeWords(type)} FAQ Answer`}
          value={faq.a}
          onChange={(v) => setFaq((p) => ({ ...p, a: v }))}
          error=""
          type="text"
          autoComplete="off"
        />
      </Box>

      <Box paddingBlockStart="200">
        <Button
          fullWidth
          variant="primary"
          icon={CodeAddIcon}
          onClick={handleAddSpecialCase}
        >
          Add
        </Button>
      </Box>

      <Box paddingBlockStart="500">
        {configs[type].faqs &&
          configs[type].faqs.map((faq) => {
            return (
              <Accordion
                title={faq.q}
                description={faq.a}
                deleteRow={handleDeleteSpecialCase}
              />
            );
          })}
      </Box>
    </BlockStack>
  );
};
