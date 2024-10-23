import {
  BlockStack,
  Box,
  Button,
  Card,
  Grid,
  Text,
  TextField,
} from "@shopify/polaris";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { ConfigurationsType } from "app/lib/types/config";
import { CodeAddIcon } from "@shopify/polaris-icons";
import { Accordion } from "../shared/Accordion";

export const SpecialCases = ({
  config,
  setConfig,
}: {
  config: ConfigurationsType;
  setConfig: Dispatch<SetStateAction<ConfigurationsType>>;
}) => {
  const [special, setSpecial] = useState({ title: "", description: "" });

  const handleAddSpecialCase = useCallback(() => {
    setConfig((p) => ({ ...p, special_cases: [...p.special_cases, special] }));
    setSpecial({ title: "", description: "" });
  }, [special]);

  const handleDeleteSpecialCase = useCallback(
    (title: string) => {
      const cases = config.special_cases.filter((s) => s.title !== title);
      setConfig((p) => ({
        ...p,
        special_cases: cases,
      }));
    },
    [special],
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
                  value={special.title}
                  onChange={(v) => setSpecial((p) => ({ ...p, title: v }))}
                  error=""
                  type="text"
                  autoComplete="off"
                />
              </Box>
              <Box paddingBlockStart="200">
                <TextField
                  label="Special Case Description"
                  value={special.description}
                  onChange={(v) =>
                    setSpecial((p) => ({ ...p, description: v }))
                  }
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
                {config.special_cases &&
                  config.special_cases.map((s) => {
                    return (
                      <Accordion
                        title={s.title}
                        description={s.description}
                        deleteRow={handleDeleteSpecialCase}
                      />
                    );
                  })}
              </Box>
            </BlockStack>
          </Card>
        </Grid.Cell>
      </Grid>
    </>
  );
};
