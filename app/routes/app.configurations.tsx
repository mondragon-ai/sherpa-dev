import { Page, BlockStack, Box } from "@shopify/polaris";
import { SaveIcon } from "@shopify/polaris-icons";
import { Automation } from "app/components/configurations/Automation";
import { Knowledge } from "app/components/configurations/Knowledge";
import { SpecialCases } from "app/components/configurations/SpecialCases";
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

        {/* SPECIAL CASES */}
        <SpecialCases />

        {/* AUTOMATION SETTINGS */}
        <Knowledge />

        <Box paddingBlockStart="200"></Box>
      </BlockStack>
    </Page>
  );
}
