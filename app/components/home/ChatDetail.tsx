import {
  capitalizeWords,
  filterNumber,
  truncateString,
} from "app/lib/utils/converters/text";
import {
  CaretDownIcon,
  CaretUpIcon,
  ChatIcon,
  OrderRepeatIcon,
} from "@shopify/polaris-icons";
import { formatNumber } from "app/lib/utils/converters/numbers";
import { formatTimestamp } from "app/lib/utils/converters/time";
import { convertMarkdownToHtml } from "./Conversation";
import { copyToClipboard } from "app/lib/utils/shared";
import { Badge, Icon, Image, Text } from "@shopify/polaris";
import { EmailDocument } from "app/lib/types/emails";
import { ChatDocument } from "app/lib/types/chats";
import { SkeletonDetail } from "./Skeleton";
import { useCallback, useState } from "react";
import { LineItem } from "app/lib/types/shared";

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
          overflow-x: hidden;
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

        .detailWrapper > .detailMain > section > .detail > .row {
          min-height: 20px
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

        .tagRow {
          width: 50%;
          display: flex;
          overflow-x: scroll;
          scrollbar-width: none;
        }

        .tagRow > span {
          margin-right: 5px;
          width: min-content;
        }
        .tagRow > span > span{
          width: max-content;
        }

        .tagRow > img {
          width: 50px;
          height: 50px;
          border-radius: 3px;
          border: 0.5px solid #d5d5d5;
          cursor: pointer;
          margin-right: 10px
        }

        .tagRow > img:hover {
          border: 0.5px solid #686868;
          box-shadow: 0 0 10px #c8c8c8;
        }

        .tagRow > header {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: flex-start;
          height: auto;
          width: 100%;
          position: relative;
          margin: 0;
          padding: 5px;
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
          tone={
            chat.status == "open"
              ? "warning"
              : chat.status == "action_required"
                ? "critical"
                : "success"
          }
          size="small"
          progress={
            chat.status == "open"
              ? "incomplete"
              : chat.status == "action_required"
                ? "partiallyComplete"
                : "complete"
          }
        >
          {capitalizeWords(chat.status || "")}
        </Badge>
      </div>
      <DetailRow
        label="Suggested Action"
        value={capitalizeWords(chat.suggested_action || "not processed yet")}
      />

      <DetailRow
        label="Action Complete"
        value={chat.suggested_action_done ? "Yes" : "No"}
      />

      <DetailRow label="Email Sent" value={chat.email_sent ? "Yes" : "No"} />
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
          <div className="row">
            <Text variant="bodySm" as={"p"} tone="subdued">
              Tags
            </Text>
            <div className="tagRow">
              {chat.customer.tags
                ? chat.customer.tags.split(",").map((t) => {
                    return (
                      <Badge tone="new" size="small">
                        {capitalizeWords(t.toLocaleLowerCase() || "")}
                      </Badge>
                    );
                  })
                : "-"}
            </div>
          </div>
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
  const [item, setItem] = useState<null | LineItem>(line_items[0] || null);
  const handleLineItem = useCallback(
    (id: string) => {
      if (!id) return setItem(null);
      const line = chat.order?.line_items.find((l) => l.variant_id == id);
      if (!line) return setItem(null);
      setItem(line);
    },
    [line_items],
  );

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
          </div>
          <div className="tagRow" style={{ padding: "10px", width: "100%" }}>
            {chat.order.line_items.map((l) => {
              if (!l.image) {
                return (
                  <Image
                    onClick={() => {
                      handleLineItem(l.variant_id);
                    }}
                    alt={"placeholder"}
                    source={
                      "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?v=1530129081"
                    }
                  />
                );
              } else {
                return (
                  <Image
                    onClick={() => {
                      handleLineItem(l.variant_id);
                    }}
                    alt={"product"}
                    source={l.image}
                  />
                );
              }
            })}
          </div>
          {item && (
            <div
              className="tagRow"
              style={{ width: "100%", flexDirection: "column" }}
            >
              <header>
                <Text variant="bodySm" as={"p"} tone="subdued" truncate={true}>
                  {item.title}
                </Text>
                {item.selling_plan ? (
                  <Badge tone={"magic"} size="small" icon={OrderRepeatIcon}>
                    Recurring
                  </Badge>
                ) : (
                  <Text variant="bodySm" as={"p"} tone="subdued">
                    x {item.quantity}
                  </Text>
                )}
              </header>
              <header>
                <Text variant="bodySm" as={"p"} tone="subdued">
                  {item.options}
                </Text>
                {item.selling_plan ? (
                  <Text variant="bodySm" as={"p"} tone="subdued">
                    x {item.quantity}
                  </Text>
                ) : null}
              </header>
            </div>
          )}
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
            <div
              dangerouslySetInnerHTML={{
                __html: convertMarkdownToHtml(chat.summary),
              }}
            />
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
