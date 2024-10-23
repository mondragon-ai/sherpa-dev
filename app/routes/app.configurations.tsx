import { useState } from "react";
import { SaveIcon } from "@shopify/polaris-icons";
import { config_state } from "app/lib/data/config";
import { Page, BlockStack, Box } from "@shopify/polaris";
import { ConfigurationsType } from "app/lib/types/config";
import { Knowledge } from "app/components/configurations/Knowledge";
import { Automation } from "app/components/configurations/Automation";
import { SpecialCases } from "app/components/configurations/SpecialCases";
import { StorePolicies } from "app/components/configurations/StorePolicies";
import { Personalize } from "app/components/configurations/Personalize";
import { Discounts } from "app/components/configurations/Discounts";

export default function AdditionalPage() {
  const [config, setConfig] = useState<ConfigurationsType>(config_state);

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
