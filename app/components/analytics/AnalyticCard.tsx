import { Card, Text, Tooltip } from "@shopify/polaris";
import { truncateString } from "app/lib/utils/converters/text";

export const AnalyticsCard = ({
  title,
  main_value,
  metric,
  children,
  fixed,
  tip,
}: {
  title: string;
  main_value?: string;
  metric?: string;
  children: React.ReactNode;
  fixed?: number;
  tip: string;
}) => (
  <>
    <style>
      {`
            .mainMetric {
                width: 100%;

            }

            .mainMetric > h2 {
                width: 100%;
                display: flex;
                flex-direction: row;
                align-items: flex-end;
                justify-content: flex-start;
                margin: 10px 0 25px;
                line-height: 1;
            }
            
            .chartWrapper {
                margin: 20px 0 0 0;
                position: relative;
                height: 225px;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
            }
        `}
    </style>
    <Card>
      <header>
        <Tooltip content={tip} hasUnderline>
          <Text variant="headingXs" fontWeight="bold" as="span">
            {title}
          </Text>
        </Tooltip>
        <div className="mainMetric">
          <Text as="h2" variant="headingXl" tone="base">
            {fixed
              ? Number(main_value).toFixed(fixed)
              : truncateString(main_value || "", 12)}
            <Text as="h5" variant="bodyMd">
              {metric}
            </Text>
          </Text>
        </div>
      </header>
      <main className="chartWrapper">{children}</main>
    </Card>
  </>
);
