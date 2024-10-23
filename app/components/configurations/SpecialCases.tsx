import {
  BlockStack,
  Box,
  Button,
  Card,
  Grid,
  Text,
  TextField,
} from "@shopify/polaris";
import { useCallback, useState } from "react";
import { CodeAddIcon, DeleteIcon } from "@shopify/polaris-icons";
import { Accordion } from "../shared/Accordion";

export const SpecialCases = () => {
  const [textFieldValue, setTextFieldValue] = useState("");
  const [checked, setChecked] = useState(false);

  const handleTextFieldChange = useCallback(
    (value: string) => setTextFieldValue(value),
    [],
  );

  const handleChange = useCallback(
    (newChecked: boolean) => setChecked(newChecked),
    [],
  );

  return (
    <>
      <Grid columns={{ sm: 3 }}>
        <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 4, xl: 4 }}>
          <Box as="section">
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">
                Special Cases
              </Text>
              <Text as="p" variant="bodyMd">
                Here, you can incorporate specific exceptional scenarios for the
                chatbot to utilize, enhancing its ability to assist customers by
                providing the most precise information about the stores.
              </Text>
            </BlockStack>
          </Box>
        </Grid.Cell>
        <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 8, xl: 8 }}>
          <Card roundedAbove="sm">
            <Text as="h2" variant="headingSm">
              Special Cases
            </Text>
            <BlockStack gap="200">
              <Box paddingBlockStart="200">
                <TextField
                  label="Special Case Title"
                  value={textFieldValue}
                  onChange={handleTextFieldChange}
                  error=""
                  type="text"
                  autoComplete="off"
                />
              </Box>
              <Box paddingBlockStart="200">
                <TextField
                  label="Special Case Description"
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
              <Box paddingBlockStart="500"></Box>
            </BlockStack>
          </Card>
        </Grid.Cell>
      </Grid>
    </>
  );
};
