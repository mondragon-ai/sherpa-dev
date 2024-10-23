import {
  BlockStack,
  Box,
  Button,
  Card,
  Grid,
  Text,
  TextField,
} from "@shopify/polaris";
import { Dispatch, SetStateAction, useCallback } from "react";
import { ConfigurationsType } from "app/lib/types/config";
import { DiscountIcon } from "@shopify/polaris-icons";

export const Discounts = ({
  config,
  setConfig,
}: {
  config: ConfigurationsType;
  setConfig: Dispatch<SetStateAction<ConfigurationsType>>;
}) => {
  const handleTextChange = useCallback(
    (v: string) =>
      setConfig((p) => ({ ...p, discounts: { ...p.discounts, value: v } })),
    [],
  );

  return (
    <Grid columns={{ sm: 3 }}>
      <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 4, xl: 4 }}>
        <Box as="section">
          <BlockStack gap="400">
            <Text as="h3" variant="headingMd">
              Discounts
            </Text>
            <Text as="p" variant="bodyMd">
              Sherpa will make an attempt to preserve the order from being
              canceled using a %-value off discount for next orders.
            </Text>
          </BlockStack>
        </Box>
      </Grid.Cell>
      <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 8, xl: 8 }}>
        <Card roundedAbove="sm">
          <Text as="h2" variant="headingSm">
            Price Rule
          </Text>
          <BlockStack gap="200">
            <Box paddingBlockStart="200">
              <TextField
                label="Discount Off (percentage)"
                value={String(config.price_rules.value)}
                onChange={handleTextChange}
                error=""
                type="number"
                autoComplete="off"
              />
              <Text as="p" variant="bodyXs" tone="magic-subdued">
                This %-value is used to create a discount for customers' next
                order.
              </Text>
            </Box>

            <Box paddingBlockStart="200">
              <Button
                fullWidth
                variant="primary"
                icon={DiscountIcon}
                onClick={() => {}}
              >
                Add
              </Button>
            </Box>
          </BlockStack>
        </Card>
      </Grid.Cell>
    </Grid>
  );
};
