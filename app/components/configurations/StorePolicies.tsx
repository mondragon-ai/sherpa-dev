import {
  BlockStack,
  Box,
  Card,
  Checkbox,
  Divider,
  Grid,
  Text,
  TextField,
} from "@shopify/polaris";
import { ConfigurationsType } from "app/lib/types/config";
import { Dispatch, SetStateAction, useCallback, useState } from "react";

export const StorePolicies = ({
  config,
  setConfig,
}: {
  config: ConfigurationsType;
  setConfig: Dispatch<SetStateAction<ConfigurationsType>>;
}) => {
  const handleTextChange = useCallback(
    (
      v: string,
      t: "contact_email" | "return" | "exception" | "shipping" | "store",
    ) => setConfig((p) => ({ ...p, [t]: v })),
    [config],
  );

  const handleChange = useCallback(
    (v: boolean, t: "refund" | "damged_items" | "exchanges") =>
      setConfig((p) => ({ ...p, [t]: v })),
    [config],
  );

  return (
    <Grid columns={{ sm: 3 }}>
      <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 4, xl: 4 }}>
        <Box as="section">
          <BlockStack gap="400">
            <Text as="h3" variant="headingMd">
              Store Policies
            </Text>
            <Text as="p" variant="bodyMd">
              Use this help the chatbot understand your rules and policies to
              better assist customers.
            </Text>
          </BlockStack>
        </Box>
      </Grid.Cell>
      <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 8, xl: 8 }}>
        <Card roundedAbove="sm">
          <Text as="h2" variant="headingSm">
            Store Based Rules & Information
          </Text>
          <BlockStack gap="200">
            <Box paddingBlockStart="200">
              <Checkbox
                label="Enable Eligible Refunds"
                checked={config.refund}
                onChange={(v) => handleChange(v, "refund")}
              />
              <Text as="p" variant="bodyXs" tone="magic-subdued">
                Items returned can receive a refund (must be returned)
              </Text>
            </Box>
            <Box paddingBlockStart="200">
              <Checkbox
                label="Accept Refund on Damaged Items"
                checked={config.damged_items}
                onChange={(v) => handleChange(v, "damged_items")}
              />
              <Text as="p" variant="bodyXs" tone="magic-subdued">
                Accept items returned that are damaged, incorrect, or otherwise
                not wanted (must be returned)
              </Text>
            </Box>
            <Box paddingBlockStart="200">
              <Checkbox
                label="Accept Exchanges"
                checked={config.exchanges}
                onChange={(v) => handleChange(v, "exchanges")}
              />
              <Text as="p" variant="bodyXs" tone="magic-subdued">
                Accept exchanges for incorrect items (must be returned)
              </Text>
            </Box>
            <Box paddingBlockStart="500">
              <Divider borderColor="border-inverse-hover" />
            </Box>
            <Box paddingBlockStart="300">
              <Grid columns={{ sm: 3 }}>
                <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 6, xl: 6 }}>
                  <TextField
                    label="Customer Support Email"
                    value={config.contact_email}
                    onChange={(v) => handleTextChange(v, "contact_email")}
                    error=""
                    autoComplete="off"
                  />
                </Grid.Cell>

                <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 6, xl: 6 }}>
                  <TextField
                    label="Max Days to Accept Returned Order"
                    value={String(config.return)}
                    onChange={(v) => handleTextChange(v, "return")}
                    error=""
                    type="number"
                    autoComplete="off"
                  />
                </Grid.Cell>
              </Grid>
            </Box>

            <Box paddingBlockStart="200">
              <TextField
                label="Refund Exception. (single sentence please)"
                value={config.exception}
                onChange={(v) => handleTextChange(v, "exception")}
                error=""
                type="text"
                autoComplete="off"
              />
            </Box>
            <Box paddingBlockStart="200">
              <TextField
                label="Shipping Policy. (single sentence please)"
                value={config.shipping}
                onChange={(v) => handleTextChange(v, "shipping")}
                error=""
                type="text"
                autoComplete="off"
              />
            </Box>

            <Box paddingBlockStart="500">
              <Divider borderColor="border-inverse-hover" />
            </Box>

            <Box paddingBlockStart="200">
              <TextField
                label="Store Summary"
                value={String(config.store)}
                onChange={(v) => handleTextChange(v, "store")}
                error=""
                type="text"
                autoComplete="off"
              />
            </Box>
          </BlockStack>
        </Card>
      </Grid.Cell>
    </Grid>
  );
};
