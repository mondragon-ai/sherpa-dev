import { useEffect, useState } from "react";
import { useLoaderData } from "@remix-run/react";
import { SaveIcon } from "@shopify/polaris-icons";
import { configAction } from "./actions/configurations";
import { Page, BlockStack, Box, Banner, Text } from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";
import { ConfigurationsType } from "app/lib/types/config";
import { configurationsLoader } from "./loaders/configurations";
import { useConfigurations } from "app/lib/hooks/configurations";
import { Discounts } from "app/components/configurations/Discounts";
import { Knowledge } from "app/components/configurations/Knowledge";
import { Automation } from "app/components/configurations/Automation";
import { Personalize } from "app/components/configurations/Personalize";
import { SpecialCases } from "app/components/configurations/SpecialCases";
import { StorePolicies } from "app/components/configurations/StorePolicies";

export const loader = configurationsLoader;
export const action = configAction;

export default function AdditionalPage() {
  const shopify = useAppBridge();
  const data = useLoaderData<typeof loader>();
  const [fetching, setFetch] = useState(true);
  const { config, error, isLoading, setConfig, setError, handleSaveConfig } =
    useConfigurations(data.configs as ConfigurationsType);

  useEffect(() => {
    if (data && fetching) {
      setConfig(data.configs as ConfigurationsType);
      shopify.toast.show(data.message);
      setFetch(false);
    }
  }, [data, shopify]);

  return (
    <Page
      title="Configurations"
      primaryAction={{
        content: "Save",
        disabled: false,
        icon: SaveIcon,
        loading: isLoading,
        onAction: handleSaveConfig,
      }}
    >
      <BlockStack gap={"300"}>
        {error.message && (
          <Banner
            onDismiss={() => setError({ message: "", type: "" })}
            tone="critical"
          >
            <Text as="p" variant="bodyMd">
              {error.message}
            </Text>
          </Banner>
        )}
        {/* STORE POLICIES */}
        <StorePolicies config={config} setConfig={setConfig} />

        {/* FAQs SETTINGS */}
        <Knowledge config={config} setConfig={setConfig} />

        {/* SPECIAL CASES */}
        <SpecialCases config={config} setConfig={setConfig} />

        {/* DISCOUNT PRICE */}
        <Discounts config={config} setConfig={setConfig} />

        {/* AUTOMATION SETTINGS */}
        <Automation config={config} setConfig={setConfig} />

        {/* PERSONALIZE SETTINGS */}
        <Personalize config={config} setConfig={setConfig} />

        <Box paddingBlockStart="200"></Box>
      </BlockStack>
    </Page>
  );
}
