import {
  capitalizeWords,
  filterNumber,
  truncateString,
} from "app/lib/utils/converters/text";
import { CaretDownIcon, CaretUpIcon, ChatIcon } from "@shopify/polaris-icons";
import { formatNumber } from "app/lib/utils/converters/numbers";
import { formatTimestamp } from "app/lib/utils/converters/time";
import { copyToClipboard } from "app/lib/utils/shared";
import { Badge, Icon, Text } from "@shopify/polaris";
import { EmailDocument } from "app/lib/types/emails";
import { ChatDocument } from "app/lib/types/chats";
import { SkeletonDetail } from "./Skeleton";
import { useState } from "react";

interface ChatProps {
  chat: null | ChatDocument | EmailDocument;
}

export const ChatDetail = ({ chat }: ChatProps) => {
  return (
    <>
      <style>
        {`
        .detailWrapper {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            height: 100%;
            width: 100%;
            position: relative;
            margin: 0;
            padding: 0px;
        }
        
        .detailWrapper > header {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            height: 50px;
            width: 100%;
            position: relative;
            margin: 0;
            padding: 10px;
            border-bottom: 1px solid var(--p-color-bg-surface-tertiary-hover);
        }

        .detailWrapper > .detailMain {
            flex-grow: 1; 
            height: auto;
            width: 100%;
            position: relative;
            margin: 0;
            overflow-y: scroll;
            padding: 0px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            height: 100%;
            width: 100%;
            position: relative;
        }
        
        .detailWrapper > .detailMain > section {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            height: auto;
            width: 100%;
            position: relative;
            margin: 0;
            padding: 10px;
            border-bottom: 1px solid var(--p-color-bg-surface-tertiary-hover);
        }


        .detail {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            height: auto;
            width: 100%;
            position: relative;
            margin: 0;
            padding: 0px;
        }

        .detailWrapper > .detailMain > section > .row,
        .detailWrapper > .detailMain > section > .detail > .row {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: flex-start;
            height: auto;
            width: 100%;
            position: relative;
            margin: 5px 0;
            padding: 0px;
        }

        .detailWrapper > .detailMain > section > .row > span,
        .detailWrapper > .detailMain > section > .detail > .row > span {
            margin: 0;
            cursor: pointer;
        }
        
        .detailWrapper > .detailMain > section > .row > span:hover,
        .detailWrapper > .detailMain > section > .detail > .row > span:hover {
            color: var(--p-color-bg-surface-tertiary-hover);
        }

        
        .detailWrapper > .detailMain > section > .row > p,
        .detailWrapper > .detailMain > section > .detail > .row > p  {
            width: 50%
        }

        `}
      </style>
      <div className={"detailWrapper"}>
        <header>
          <Text variant="headingLg" as={"strong"}>
            Details
          </Text>
        </header>
        <div className="detailMain">
          {chat ? (
            <>
              <ChatDetails chat={chat} />
              <CustomerDetail chat={chat} />
              <OrderDetail chat={chat} />
              <SummaryDetail chat={chat} />
            </>
          ) : (
            <>
              <SkeletonDetail />
            </>
          )}
        </div>
      </div>
    </>
  );
};

const ChatDetails = ({ chat }: ChatProps) => {
  if (!chat) return null;

  return (
    <section>
      <div className="row">
        <Text variant="bodySm" as={"p"} tone="subdued">
          Ticket Issue
        </Text>
        {chat.classification ? (
          <Badge tone={"new"} size="small" icon={ChatIcon}>
            {capitalizeWords(chat.classification?.toLocaleLowerCase())}
          </Badge>
        ) : (
          <Text variant="bodySm" as={"p"} tone="subdued">
            -
          </Text>
        )}
      </div>
      <DetailRow label="Inquiry" value={capitalizeWords(chat.issue || "-")} />
      {(chat as ChatDocument).specific_issue && (
        <DetailRow
          label="Specific Issue"
          value={truncateString(
            capitalizeWords((chat as ChatDocument).specific_issue || "-"),
            20,
          )}
        />
      )}
      <div className="row">
        <Text variant="bodySm" as={"p"} tone="subdued">
          Status
        </Text>
        <Badge
          tone={chat.status == "open" ? "warning" : "success"}
          size="small"
          progress={chat.status == "open" ? "partiallyComplete" : "complete"}
        >
          {capitalizeWords(chat.status || "")}
        </Badge>
      </div>
      <DetailRow
        label="Suggested Action"
        value={capitalizeWords(chat.suggested_action || "not processed yet")}
      />
      <DetailRow
        label="Sentiment"
        value={capitalizeWords(chat.sentiment || "-")}
      />
      <DetailRow
        label="Customer Rating"
        value={capitalizeWords(chat.rating || "-")}
      />
      <DetailRow
        label="Created At"
        value={formatTimestamp(Number(chat.created_at))}
      />
    </section>
  );
};

const CustomerDetail = ({ chat }: ChatProps) => {
  if (!chat) return null;

  if (!chat.customer) {
    return (
      <section>
        <div
          onClick={() => {}}
          className="row"
          style={{ justifyContent: "space-between", marginBottom: "15px" }}
        >
          <Text variant="headingMd" as={"strong"} tone="base">
            Customer Summary
          </Text>
          <Icon source={CaretUpIcon} />
        </div>
      </section>
    );
  }

  const {
    first_name,
    last_name,
    email,
    id,
    total_orders,
    total_spent,
    address,
  } = chat.customer;
  const [open, toggleOpen] = useState(false);

  return (
    <section>
      <ToggleHeader
        title="Customer Summary"
        open={open}
        onClick={() => toggleOpen(!open)}
      />
      {open && (
        <div className="detail">
          <DetailRow label="Name" value={`${first_name} ${last_name}`} />
          <DetailRow
            label="Email"
            value={email}
            onClick={() => copyToClipboard(email)}
          />
          <DetailRow
            label="ID"
            onClick={() => copyToClipboard(id)}
            value={id}
          />
          <DetailRow label="Address" value={address} />
          <DetailRow
            label="Total Spent"
            value={`$${formatNumber(Number(total_spent))}`}
          />
          <DetailRow label="Total Orders" value={total_orders.toString()} />
        </div>
      )}
    </section>
  );
};

const OrderDetail = ({ chat }: ChatProps) => {
  if (!chat) return null;

  if (!chat.order) {
    return (
      <section>
        <div
          onClick={() => {}}
          className="row"
          style={{ justifyContent: "space-between", marginBottom: "15px" }}
        >
          <Text variant="headingMd" as={"strong"} tone="base">
            Order Summary
          </Text>
          <Icon source={CaretUpIcon} />
        </div>
      </section>
    );
  }

  const {
    order_id,
    order_number,
    payment_status,
    fulfillment_status,
    current_total_price,
    created_at,
    line_items,
    tracking_url,
  } = chat.order;
  const [open, toggleOpen] = useState(false);

  console.log(created_at);

  return (
    <section>
      <ToggleHeader
        title="Order Summary"
        open={open}
        onClick={() => toggleOpen(!open)}
      />
      {open && (
        <div className="detail">
          <DetailRow
            label="Order ID"
            onClick={() => copyToClipboard(order_id)}
            value={filterNumber(order_id)}
          />
          <DetailRow label="Order Number" value={`${order_number}`} />
          <div className="row">
            <Text variant="bodySm" as={"p"} tone="subdued">
              Paid Status
            </Text>
            <Badge tone={"success"} size="small" progress={"complete"}>
              {capitalizeWords(payment_status)}
            </Badge>
          </div>
          <DetailRow
            label="Total Price"
            value={`$${formatNumber(Number(current_total_price))}`}
          />
          <div className="row">
            <Text variant="bodySm" as={"p"} tone="subdued">
              Fulfillment Status
            </Text>
            <Badge tone={"warning"} size="small" progress={"partiallyComplete"}>
              {capitalizeWords(fulfillment_status)}
            </Badge>
          </div>

          <DetailRow
            label="Tracking"
            onClick={() => copyToClipboard(tracking_url)}
            value={tracking_url ? "URL" : "-"}
          />
          <DetailRow
            label="Placed At"
            value={formatTimestamp(Number(created_at))}
          />
          <div className="row">
            <Text variant="bodySm" as={"p"} tone="subdued">
              Line Items
            </Text>
            <Text variant="bodySm" as={"p"} tone="base" breakWord>
              {line_items &&
                line_items.map((l) => {
                  return (
                    <>
                      {`${truncateString(l.title, 5)} x ${l.quantity} - ${l.options}`}
                      <br />
                    </>
                  );
                })}
            </Text>
          </div>
        </div>
      )}
    </section>
  );
};

const SummaryDetail = ({ chat }: ChatProps) => {
  if (!chat) return null;

  if (!chat.summary) {
    return (
      <section>
        <div
          onClick={() => {}}
          className="row"
          style={{ justifyContent: "space-between", marginBottom: "15px" }}
        >
          <Text variant="headingMd" as={"strong"} tone="base">
            Recent Chat Summary
          </Text>
          <Icon source={CaretUpIcon} />
        </div>
      </section>
    );
  }
  const [open, toggleOpen] = useState(false);

  return (
    <section>
      <ToggleHeader
        title="Recent Chat Summary"
        open={open}
        onClick={() => toggleOpen(!open)}
      />
      {open && (
        <div className="detail" style={{ width: "100%" }}>
          <Text variant="bodySm" as={"p"} tone={"base"} breakWord>
            {chat.summary}
          </Text>
        </div>
      )}
    </section>
  );
};

const DetailRow = ({
  label,
  value,
  onClick,
}: {
  label: string;
  value: string | JSX.Element;
  onClick?: () => void;
}) => (
  <div
    className="row"
    onClick={onClick}
    style={{ cursor: onClick ? "pointer" : "" }}
  >
    <Text variant="bodySm" as={"p"} tone="subdued">
      {label}
    </Text>
    <Text
      variant="bodySm"
      as={"p"}
      tone={onClick ? "magic-subdued" : "base"}
      breakWord
    >
      {value}
    </Text>
  </div>
);

const ToggleHeader = ({
  title,
  open,
  onClick,
}: {
  title: string;
  open: boolean;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className="row"
    style={{ justifyContent: "space-between", marginBottom: "15px" }}
  >
    <Text variant="headingMd" as={"strong"} tone="base">
      {title}
    </Text>
    <Icon source={open ? CaretDownIcon : CaretUpIcon} />
  </div>
);
