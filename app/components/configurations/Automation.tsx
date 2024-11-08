import { BlockStack, Box, Card, Checkbox, Grid, Text } from "@shopify/polaris";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { ConfigurationsType } from "app/lib/types/config";

export const Automation = ({
  config,
  setConfig,
}: {
  config: ConfigurationsType;
  setConfig: Dispatch<SetStateAction<ConfigurationsType>>;
}) => {
  const handleChange = useCallback(
    (v: boolean, t: "automate_actions" | "automate_emails") =>
      setConfig((p) => ({ ...p, [t]: v })),
    [config],
  );

  return (
    <Grid columns={{ sm: 3 }}>
      <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 4, xl: 4 }}>
        <Box as="section">
          <BlockStack gap="400">
            <Text as="h3" variant="headingMd">
              Automation
            </Text>
            <Text as="p" variant="bodyMd">
              Toggle the settings to allow Sherpa to automatically send emails
              and resolve issues. Be sure to integrate your email first.
            </Text>
          </BlockStack>
        </Box>
      </Grid.Cell>
      <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 8, xl: 8 }}>
        <Card roundedAbove="sm">
          <Text as="h2" variant="headingSm">
            Automation
          </Text>
          <BlockStack gap="200">
            <Box paddingBlockStart="200">
              <Checkbox
                label="Automate Actions"
                checked={config.automate_actions}
                onChange={(v) => handleChange(v, "automate_actions")}
              />
              <Text as="p" variant="bodyXs" tone="magic-subdued">
                Allow Sherpa to perform actions automatically: Cancel Orders,
                Create Discounts, Status Update, Resolve
              </Text>
            </Box>
            <Box paddingBlockStart="200">
              <Checkbox
                label="Automate Emails"
                checked={config.automate_emails}
                onChange={(v) => handleChange(v, "automate_emails")}
              />
              <Text as="p" variant="bodyXs" tone="magic-subdued">
                Allow Sherpa Automatically send emails once resolved (must have
                actions on as well)
              </Text>
            </Box>
          </BlockStack>
        </Card>
      </Grid.Cell>
    </Grid>
  );
};
