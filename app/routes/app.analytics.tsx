import { Page, Grid, Text, BlockStack, Box } from "@shopify/polaris";
import {
  BarChartStats,
  HalfCircleStats,
  LineChartStats,
  PieChartStats,
} from "app/components/analytics/Charts";
import { AnalyticsCard } from "app/components/analytics/AnalyticCard";

const line_chart = [
  {
    date: "m",
    value: 1,
  },
  {
    date: "t",
    value: 3,
  },
  {
    date: "w",
    value: 2,
  },
  {
    date: "t",
    value: 2,
  },
  {
    date: "f",
    value: 1,
  },
  {
    date: "s",
    value: 4,
  },
];

const bar_chart = [
  {
    name: "Order Status",
    value: 4,
  },
  {
    name: "Refund",
    value: 2,
  },
  {
    name: "Exchange",
    value: 1,
  },
  {
    name: "Cancel Order",
    value: 2,
  },
  {
    name: "Cancel Subscription",
    value: 2,
  },
  {
    name: "Giveaway",
    value: 1,
  },
  {
    name: "General",
    value: 3,
  },
  {
    name: "Product",
    value: 1,
  },
];

export default function Integrate() {
  return (
    <Page
      fullWidth
      title="Analytics"
      subtitle="Last Updated: Oct 21, 24 2:00 PM"
    >
      <BlockStack gap="400">
        <TopAnalytics />
        <MiddleAnalytics />
        <Box paddingBlockStart="200"></Box>
      </BlockStack>
    </Page>
  );
}

const TopAnalytics = () => {
  return (
    <Grid columns={{ sm: 3 }}>
      <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 4, xl: 4 }}>
        <AnalyticsCard
          title={"Incoming Emails"}
          main_value={"22"}
          metric={""}
          fixed={0}
          tip="Total emails received"
        >
          <LineChartStats suffix={""} data={line_chart} />
        </AnalyticsCard>
      </Grid.Cell>
      <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 4, xl: 4 }}>
        <AnalyticsCard
          title={"Incoming Chats"}
          main_value={"10"}
          metric={""}
          fixed={0}
          tip="Total chats received"
        >
          <LineChartStats suffix={""} data={line_chart} />
        </AnalyticsCard>
      </Grid.Cell>
      <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 4, xl: 4 }}>
        <AnalyticsCard
          title={"Answered Rate"}
          main_value={"87.6"}
          metric={"%"}
          fixed={1}
          tip="Ratio of inbound requests answered without human intervention required"
        >
          <HalfCircleStats
            text={"Answered"}
            completed={86.7 / 100}
            data={[
              {
                name: "completed",
                value: 86.7 / 100,
              },
              {
                name: "needed",
                value: 1 - 86.7 / 100,
              },
            ]}
          />
        </AnalyticsCard>
      </Grid.Cell>
    </Grid>
  );
};

const MiddleAnalytics = () => {
  return (
    <Grid columns={{ sm: 3 }}>
      <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 4, xl: 4 }}>
        <AnalyticsCard
          title={"Resolution Rate"}
          main_value={"55.5"}
          metric={"%"}
          fixed={1}
          tip="Ratio of inbound requests resolved automatically"
        >
          <HalfCircleStats
            text={"Resolved"}
            completed={57 / 100}
            data={[
              {
                name: "completed",
                value: 57 / 100,
              },
              {
                name: "needed",
                value: 1 - 57 / 100,
              },
            ]}
          />
        </AnalyticsCard>
      </Grid.Cell>
      <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 8, xl: 8 }}>
        <AnalyticsCard
          title={"Total Volume"}
          main_value={"33"}
          metric={""}
          fixed={0}
          tip="Total emails & chats received"
        >
          <LineChartStats suffix={""} data={line_chart} />
        </AnalyticsCard>
      </Grid.Cell>
      <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 4, xl: 4 }}>
        <AnalyticsCard
          title={"Reasons for Requests"}
          main_value={"Cancel Subscription"}
          metric={""}
          fixed={0}
          tip="Top reasons inquires were initiated"
        >
          <BarChartStats
            color={"#e85f5c"}
            data={bar_chart}
            suffix={""}
            fixed={0}
          />
        </AnalyticsCard>
      </Grid.Cell>
      <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 4, xl: 4 }}>
        <AnalyticsCard
          title={"CSAT"}
          main_value={Math.round(100 * (500 / (500 + 300 + 200))).toFixed(1)}
          metric={"%"}
          fixed={1}
          tip="Customer satisfaction post survey"
        >
          <PieChartStats
            data={[
              { name: "Positive", value: 500 },
              { name: "Neutral", value: 300 },
              { name: "Negative", value: 200 },
            ]}
          />
        </AnalyticsCard>
      </Grid.Cell>
      <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 4, xl: 4 }}>
        <AnalyticsCard
          title={"New Customers"}
          main_value={"30"}
          metric={""}
          fixed={0}
          tip="New Customers created from chat or email"
        >
          <LineChartStats suffix={""} data={line_chart} />
        </AnalyticsCard>
      </Grid.Cell>
    </Grid>
  );
};
