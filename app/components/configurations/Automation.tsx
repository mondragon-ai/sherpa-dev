import { BlockStack, Box, Card, Checkbox, Grid, Text } from "@shopify/polaris";
import { useCallback, useState } from "react";

export const Automation = () => {
  const [checked, setChecked] = useState(false);
  const handleChange = useCallback(
    (newChecked: boolean) => setChecked(newChecked),
    [],
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
                checked={checked}
                onChange={handleChange}
              />
              <Text as="p" variant="bodyXs" tone="magic-subdued">
                Allow Sherpa to perform actions automatically: Cancel Orders,
                Create Discounts, Status Update, Resolve
              </Text>
            </Box>
            <Box paddingBlockStart="200">
              <Checkbox
                label="Automate Emails"
                checked={checked}
                onChange={handleChange}
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
