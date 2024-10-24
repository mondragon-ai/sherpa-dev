import { useEffect, useState } from "react";
import { useLoaderData } from "@remix-run/react";
import { SaveIcon } from "@shopify/polaris-icons";
import { config_state } from "app/lib/data/config";
import { Page, BlockStack, Box } from "@shopify/polaris";
import { ConfigurationsType } from "app/lib/types/config";
import { configurationsLoader } from "./loaders/configurations";
import { Discounts } from "app/components/configurations/Discounts";
import { Knowledge } from "app/components/configurations/Knowledge";
import { Automation } from "app/components/configurations/Automation";
import { Personalize } from "app/components/configurations/Personalize";
import { SpecialCases } from "app/components/configurations/SpecialCases";
import { StorePolicies } from "app/components/configurations/StorePolicies";

export const loader = configurationsLoader;

export default function AdditionalPage() {
  const data = useLoaderData<typeof loader>();
  const [fetching, setFetch] = useState(true);
  const [config, setConfig] = useState<ConfigurationsType>(config_state);

  useEffect(() => {
    if (data) {
      shopify.toast.show(data.message);
      setConfig(data.configs as ConfigurationsType);
      setFetch(false);
    }
  }, [data, shopify]);
  console.log(data);

  return (
    <Page
      title="Configurations"
      primaryAction={{ content: "Save", disabled: true, icon: SaveIcon }}
    >
      <BlockStack gap={"300"}>
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
