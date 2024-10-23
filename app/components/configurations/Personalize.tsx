import {
  BlockStack,
  Box,
  Card,
  Checkbox,
  Grid,
  Icon,
  Text,
  TextField,
} from "@shopify/polaris";
import {
  SmileyHappyIcon,
  MagicIcon,
  ConfettiIcon,
} from "@shopify/polaris-icons";
import { ConfigurationsType } from "app/lib/types/config";
import { Dispatch, SetStateAction, useCallback, useState } from "react";

export const Personalize = ({
  config,
  setConfig,
}: {
  config: ConfigurationsType;
  setConfig: Dispatch<SetStateAction<ConfigurationsType>>;
}) => {
  const [tone, setTone] = useState<"custom" | "playful" | "standard">("custom");
  const handleChange = useCallback(
    (v: string) => setConfig((p) => ({ ...p, custom_tone: v })),
    [tone],
  );

  const handleToneSelect = useCallback(
    (v: "custom" | "playful" | "standard") => {
      setTone(v);
      setConfig((p) => ({ ...p, tone: v }));
    },
    [tone],
  );

  return (
    <>
      <style>
        {`
          .toneWrapper {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            height: 100px;
            width: 100%;
            position: relative;
            margin: 0;
            padding: 0px;
            margin-bottom: 5px;
            border: 1px solid var(--p-color-bg-surface-tertiary-hover);
            border-radius: 5px
          }
          .toneWrapper > div {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            height: 100%;
            width: 100%;
            position: relative;
            margin: 0;
            padding: 10px;
            cursor: pointer;
          }

          .toneWrapper > div > h2:first-of-type {
            margin-bottom: 15px;
            display: flex;
            align-items: center;
          }


          .toneWrapper > div:hover {
            background: var(--p-color-bg-surface-tertiary-hover);
          }
        `}
      </style>
      <Grid columns={{ sm: 3 }}>
        <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 4, xl: 4 }}>
          <Box as="section">
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">
                Personalize
              </Text>
              <Text as="p" variant="bodyMd">
                Here you can modify the tone of the Sherpa's response to
                clients.
              </Text>
            </BlockStack>
          </Box>
        </Grid.Cell>
        <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 8, xl: 8 }}>
          <Card roundedAbove="sm">
            <Text as="h2" variant="headingSm">
              Choose The Tone
            </Text>
            <BlockStack gap="200">
              <Box paddingBlockStart="200">
                <div className="toneWrapper">
                  <div
                    onClick={() => handleToneSelect("playful")}
                    style={{
                      background:
                        tone == "playful"
                          ? "var(--p-color-bg-surface-tertiary-hover)"
                          : "",
                    }}
                  >
                    <Text as="h2" variant="headingXs" tone="base">
                      <Icon source={ConfettiIcon} /> Playful
                    </Text>
                    <Text as="h2" variant="bodySm" tone="caution">
                      Fun, playful, with limited sarcasm.
                    </Text>
                  </div>
                  <div
                    onClick={() => handleToneSelect("standard")}
                    style={{
                      background:
                        tone == "standard"
                          ? "var(--p-color-bg-surface-tertiary-hover)"
                          : "",
                    }}
                  >
                    <Text as="h2" variant="headingXs" tone="base">
                      <Icon source={SmileyHappyIcon} />
                      Standard
                    </Text>
                    <Text as="h2" variant="bodySm" tone="caution">
                      Informal, professional, respectful, and clear
                    </Text>
                  </div>
                  <div
                    onClick={() => handleToneSelect("custom")}
                    style={{
                      background:
                        tone == "custom"
                          ? "var(--p-color-bg-surface-tertiary-hover)"
                          : "",
                    }}
                  >
                    <Text as="h2" variant="headingXs" tone="base">
                      <Icon source={MagicIcon} /> Custom
                    </Text>
                    <Text as="h2" variant="bodySm" tone="caution">
                      Give Sherpa your a tone that best reflects your store.
                    </Text>
                  </div>
                </div>
              </Box>
              {tone == "custom" ? (
                <Box paddingBlockStart="200">
                  <TextField
                    label={"Custom Tone"}
                    value={config.custom_tone}
                    onChange={handleChange}
                    error=""
                    placeholder="Comedic responses with vulgar language"
                    type="text"
                    autoComplete="off"
                  />
                  <Text as="p" variant="bodyXs" tone="magic-subdued">
                    Please be consice
                  </Text>
                </Box>
              ) : null}
            </BlockStack>
          </Card>
        </Grid.Cell>
      </Grid>
    </>
  );
};
