import { AnalyticsDocument, CleanedAnalytics } from "../types/analytics";
import { capitalizeWords } from "../utils/converters/text";

export const cleanIncomingAnalytics = (
  analytics: AnalyticsDocument[] | null,
  tz = "America/New_York",
) => {
  const ln = analytics ? analytics.length : 0;
  const cleaned = {
    incoming_emails: [],
    total_volume: [],
    incoming_chats: [],
    resolution_ratio: [],
    csat: [],
    top_errors: [],
    top_issues: [],
    top_tickets: [],
    sentiment_analysis: [],
    category_csat: [],
    volume: 0,
    email: 0,
    chats: 0,
    ratio: 0,
    top_sentiment: 0,
    top_ticket: "",
    top_issue: "",
    top_csat: 0,
  } as CleanedAnalytics;

  if (!analytics) return cleaned;

  let sherpa = 0;
  let human = 0;

  let csat_positive = 0;
  let csat_neutral = 0;
  let csat_negative = 0;

  let sentiment_positive = 0;
  let sentiment_neutral = 0;
  let sentiment_negative = 0;

  const top_issues: Record<string, number> = {};
  const top_tickets: Record<string, number> = {};
  for (const doc of analytics) {
    cleaned.email += doc.total_emails.length;
    cleaned.incoming_emails.push(...aggregateTime(doc.total_emails, tz, ln));

    cleaned.chats += doc.total_chats.length;
    cleaned.total_volume.push(...aggregateTime(doc.total_volume, tz, ln));

    cleaned.volume += doc.total_volume.length;
    cleaned.incoming_chats.push(...aggregateTime(doc.total_chats, tz, ln));

    sherpa += doc.resolution_ratio.sherpa;
    human += doc.resolution_ratio.human;

    csat_positive += doc.csat.positive;
    csat_neutral += doc.csat.neutral;
    csat_negative += doc.csat.negative;

    sentiment_positive += doc.sentiment_analysis.positive;
    sentiment_neutral += doc.sentiment_analysis.neutral;
    sentiment_negative += doc.sentiment_analysis.negative;

    for (const [issue, count] of Object.entries(doc.top_issues)) {
      const i = issue.toLocaleLowerCase();
      top_issues[capitalizeWords(i)] =
        (top_issues[capitalizeWords(i)] || 0) + count;
    }

    for (const [issue, count] of Object.entries(doc.top_tickets)) {
      const i = issue.toLocaleLowerCase();
      top_tickets[capitalizeWords(i)] =
        (top_tickets[capitalizeWords(i)] || 0) + count;
    }
  }

  cleaned.ratio = 100 * Number(human / (Number(human + sherpa) || 1));

  cleaned.resolution_ratio.push({
    name: "sherpa",
    value: sherpa,
  });
  cleaned.resolution_ratio.push({
    name: "human",
    value: human,
  });

  cleaned.csat.push({
    name: "positive",
    value: csat_positive,
  });
  cleaned.csat.push({
    name: "neutral",
    value: csat_neutral,
  });
  cleaned.csat.push({
    name: "negative",
    value: csat_negative,
  });

  cleaned.sentiment_analysis.push({
    name: "positive",
    value: sentiment_positive,
  });
  cleaned.sentiment_analysis.push({
    name: "neutral",
    value: sentiment_neutral,
  });
  cleaned.sentiment_analysis.push({
    name: "negative",
    value: sentiment_negative,
  });

  for (const [issue, count] of Object.entries(top_issues)) {
    cleaned.top_issues.push({ name: issue, value: count });
  }

  for (const [issue, count] of Object.entries(top_tickets)) {
    cleaned.top_tickets.push({ name: issue, value: count });
  }
  cleaned.top_ticket = getTopKey(cleaned.top_tickets);
  cleaned.top_issue = getTopKey(cleaned.top_issues);

  cleaned.top_csat = getTopRating(csat_positive, csat_negative);
  cleaned.top_sentiment = getTopRating(sentiment_positive, sentiment_negative);

  return cleaned;
};

const getTopKey = (array: { name: string; value: number }[]) => {
  return array.reduce((top, pair) => (pair.value > top.value ? pair : top), {
    name: "",
    value: 0,
  }).name;
};

const getTopRating = (positive: number, negative: number) => {
  return Number(positive / (positive + negative || 1)) * 100;
};

const aggregateTime = (
  dataArray: { date: string; value: number }[],
  timezone: string,
  ln: number,
) => {
  const hourCounts: Record<string, number> = {};

  for (const item of dataArray) {
    const timeInSeconds = item.date ? Number(item.date) : 1706892588;
    const date = new Date(timeInSeconds * 1000);
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      year: "numeric",
      month: "short",
      weekday: "short",
      day: "2-digit",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    const formattedDate = date.toLocaleString("en-US", options);

    if (formattedDate) {
      const [wd, month, day, year, time, ampm] = formattedDate.split(" ");

      const timeParts = time.split(":");
      let hours = parseInt(timeParts[0]);

      if (ln >= 60) {
        hourCounts[month] = (hourCounts[month] || 0) + item.value;
      } else if (ln >= 7) {
        const d = `${wd} ${day.replace(",", "")}`;
        hourCounts[d] = (hourCounts[d] || 0) + item.value;
      } else {
        const hourKey = `${hours} ${ampm}`;
        hourCounts[hourKey] = (hourCounts[hourKey] || 0) + item.value;
      }
    }
  }

  return Object.entries(hourCounts).map(([date, value]) => ({ date, value }));
};
