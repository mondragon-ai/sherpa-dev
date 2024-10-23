import { Page, BlockStack } from "@shopify/polaris";
import { SaveIcon } from "@shopify/polaris-icons";
import { Automation } from "app/components/configurations/Automation";
import { StorePolicies } from "app/components/configurations/StorePolicies";

export default function AdditionalPage() {
  return (
    <Page
      title="Configurations"
      primaryAction={{ content: "Save", disabled: true, icon: SaveIcon }}
    >
      <BlockStack gap={"300"}>
        {/* AUTOMATION SETTINGS */}
        <Automation />

        {/* STORE POLICIES */}
        <StorePolicies />

        {/* AUTOMATION SETTINGS */}

        {/* AUTOMATION SETTINGS */}
      </BlockStack>
    </Page>
  );
}
