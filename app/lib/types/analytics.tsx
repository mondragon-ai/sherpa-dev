export type NameValueProps = { name: string; value: number };
export type ChartDateProps = { date: string; value: number };

export type AnalyticsDocument = {
  id: number;
  total_chats: LineChart[];
  total_emails: LineChart[];
  total_volume: LineChart[];
  resolution_ratio: { sherpa: number; human: number };
  csat: { positive: number; negative: number; neutral: number };
  top_errors: Record<string, number>;
  top_issues: Record<string, number>;
  top_tickets: Record<string, number>;
  sentiment_analysis: { positive: number; negative: number; neutral: number };
  created_at: number;
  updated_at: number;
  category_csat: Record<
    string,
    { positive: number; neutral: number; negative: number }
  >;
};

export type LineChart = {
  date: string;
  value: number;
};

export type BarChart = {
  name: string;
  value: number;
};

export type TimeFrameTypes =
  | "today"
  | "seven_days"
  | "thirty_days"
  | "ninety_days"
  | "twelve_months";

export type CleanedAnalytics = {
  incoming_emails: LineChart[];
  total_volume: LineChart[];
  incoming_chats: LineChart[];
  resolution_ratio: BarChart[];
  csat: BarChart[];
  top_errors: BarChart[];
  top_issues: BarChart[];
  top_tickets: BarChart[];
  sentiment_analysis: BarChart[];
  category_csat: BarChart[];
  volume: number;
  email: number;
  chats: number;
  ratio: number;
  top_sentiment: number;
  top_ticket: string;
  top_issue: string;
  top_csat: number;
};
