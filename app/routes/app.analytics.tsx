import { Page, Grid, Text, BlockStack, Box } from "@shopify/polaris";
import {
  BarChartStats,
  HalfCircleStats,
  LineChartStats,
  PieChartStats,
} from "app/components/analytics/Charts";
import { AnalyticsCard } from "app/components/analytics/AnalyticCard";
import { analyticsLoader } from "./loaders/analytics";
import { useLoaderData } from "@remix-run/react";
import { useAnalytics } from "app/lib/hooks/useAnalytics";
import { useEffect } from "react";
import { CleanedAnalytics } from "app/lib/types/analytics";
import { CalendarIcon } from "@shopify/polaris-icons";
import { cleanIncomingAnalytics } from "app/lib/data/analytics";
import { analyticsAction } from "./actions/analytics";

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

[
  {
    name: "completed",
    value: 86.7 / 100,
  },
  {
    name: "needed",
    value: 1 - 86.7 / 100,
  },
];

export const loader = analyticsLoader;
export const action = analyticsAction;

export default function Analytics() {
  const data = useLoaderData<typeof loader>();
  const { isLoading, analytics, error, setError, setAnalytics, handleSearch } =
    useAnalytics();

  useEffect(() => {
    if (data && data.analytics) {
      setAnalytics(data.analytics as any);
    }
  }, []);

  const cleaned = cleanIncomingAnalytics(analytics);

  return (
    <Page
      fullWidth
      title="Analytics"
      actionGroups={[
        {
          title: "Choose Timeframe",
          icon: CalendarIcon,
          actions: [
            {
              content: "Today",
              onAction: () => handleSearch("today"),
            },
            {
              content: "Last 7 Days",
              onAction: () => handleSearch("seven_days"),
            },
            {
              content: "Last 30 Days",
              onAction: () => handleSearch("thirty_days"),
            },
            {
              content: "Last 90 Days",
              onAction: () => handleSearch("ninety_days"),
            },
            {
              content: "Last 12 Months",
              onAction: () => handleSearch("twelve_months"),
            },
          ],
        },
      ]}
    >
      <BlockStack gap="400">
        <TopAnalytics analytics={cleaned} />
        <MiddleAnalytics analytics={cleaned} />
        <Box paddingBlockStart="200"></Box>
      </BlockStack>
    </Page>
  );
}

const TopAnalytics = ({ analytics }: { analytics: CleanedAnalytics }) => {
  const {
    incoming_chats,
    incoming_emails,
    resolution_ratio,
    email,
    chats,
    ratio,
  } = analytics;

  return (
    <Grid columns={{ sm: 3 }}>
      <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 4, xl: 4 }}>
        <AnalyticsCard
          title={"Incoming Emails"}
          main_value={`${email}`}
          metric={""}
          fixed={0}
          tip="Total emails received"
        >
          {incoming_chats.length ? (
            <LineChartStats suffix={""} data={incoming_chats} />
          ) : (
            <SkeletonChart />
          )}
        </AnalyticsCard>
      </Grid.Cell>
      <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 4, xl: 4 }}>
        <AnalyticsCard
          title={"Incoming Chats"}
          main_value={`${chats}`}
          metric={""}
          fixed={0}
          tip="Total chats received"
        >
          {incoming_emails.length ? (
            <LineChartStats suffix={""} data={incoming_emails} />
          ) : (
            <SkeletonChart />
          )}
        </AnalyticsCard>
      </Grid.Cell>
      <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 4, xl: 4 }}>
        <AnalyticsCard
          title={"Resolution Ratio"}
          main_value={`${ratio * 100}`}
          metric={"%"}
          fixed={1}
          tip="Ratio of inbound requests resolved without human intervention required"
        >
          {resolution_ratio.length ? (
            <HalfCircleStats
              text={"Human"}
              completed={ratio}
              data={resolution_ratio}
            />
          ) : (
            <SkeletonChart />
          )}
        </AnalyticsCard>
      </Grid.Cell>
    </Grid>
  );
};

const MiddleAnalytics = ({ analytics }: { analytics: CleanedAnalytics }) => {
  const {
    sentiment_analysis,
    total_volume,
    top_issues,
    top_tickets,
    csat,
    volume,
    top_sentiment,
    top_issue,
    top_ticket,
    top_csat,
  } = analytics;
  return (
    <Grid columns={{ sm: 3 }}>
      <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 4, xl: 4 }}>
        <AnalyticsCard
          title={"Sentiment Analysis"}
          main_value={`${top_sentiment}`}
          metric={"%"}
          fixed={1}
          tip="Caclulated rating for tickets"
        >
          {sentiment_analysis.length ? (
            <PieChartStats data={sentiment_analysis} />
          ) : (
            <SkeletonChart />
          )}
        </AnalyticsCard>
      </Grid.Cell>
      <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 8, xl: 8 }}>
        <AnalyticsCard
          title={"Total Volume"}
          main_value={`${volume}`}
          metric={""}
          fixed={0}
          tip="Total emails & chats received"
        >
          {total_volume.length ? (
            <LineChartStats suffix={""} data={total_volume} />
          ) : (
            <SkeletonChart />
          )}
        </AnalyticsCard>
      </Grid.Cell>
      <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 4, xl: 4 }}>
        <AnalyticsCard
          title={"Reasons for Requests"}
          main_value={top_issue}
          metric={""}
          fixed={0}
          tip="Top reasons inquires were initiated"
        >
          {top_issues.length ? (
            <BarChartStats
              color={"#e85f5c"}
              data={top_issues}
              suffix={""}
              fixed={0}
            />
          ) : (
            <SkeletonChart />
          )}
        </AnalyticsCard>
      </Grid.Cell>
      <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 4, xl: 4 }}>
        <AnalyticsCard
          title={"CSAT"}
          main_value={`${top_csat}`}
          metric={"%"}
          fixed={1}
          tip="Customer satisfaction post survey"
        >
          {csat.length ? <PieChartStats data={csat} /> : <SkeletonChart />}
        </AnalyticsCard>
      </Grid.Cell>
      <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 4, xl: 4 }}>
        <AnalyticsCard
          title={"Top Tickets"}
          main_value={top_ticket}
          metric={""}
          fixed={0}
          tip="Top actions required for the chat to be resolved"
        >
          {top_tickets.length ? (
            <BarChartStats
              color={"#e85f5c"}
              data={top_tickets}
              suffix={""}
              fixed={0}
            />
          ) : (
            <SkeletonChart />
          )}
        </AnalyticsCard>
      </Grid.Cell>
    </Grid>
  );
};

export const SkeletonChart = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#e1e1e1",
        borderRadius: "5px",
      }}
    ></div>
  );
};
