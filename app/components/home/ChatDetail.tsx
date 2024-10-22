import { capitalizeWords, truncateString } from "app/lib/utils/converters/text";
import { CaretDownIcon, CaretUpIcon } from "@shopify/polaris-icons";
import { formatNumber } from "app/lib/utils/converters/numbers";
import { formatTimestamp } from "app/lib/utils/converters/time";
import { copyToClipboard } from "app/lib/utils/shared";
import { Badge, Icon, Text } from "@shopify/polaris";
import { ChatDocument } from "app/lib/types/chats";
import { useState } from "react";

interface ChatProps {
  chat: ChatDocument;
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
          <ChatDetails chat={chat} />
          <CustomerDetail chat={chat} />
          <OrderDetail chat={chat} />
        </div>
      </div>
    </>
  );
};

const ChatDetails = ({ chat }: ChatProps) => {
  return (
    <section>
      <div className="row">
        <Text variant="bodySm" as={"p"} tone="subdued">
          Inquiry
        </Text>
        <Text variant="bodySm" as={"p"} tone="base">
          {capitalizeWords(chat.issue)}
        </Text>
      </div>

      <div className="row">
        <Text variant="bodySm" as={"p"} tone="subdued">
          Status
        </Text>
        <Badge
          tone={chat.status == "open" ? "warning" : "success"}
          size="small"
          progress={chat.status == "open" ? "partiallyComplete" : "complete"}
        >
          {capitalizeWords(chat.status)}
        </Badge>
      </div>

      <div className="row">
        <Text variant="bodySm" as={"p"} tone="subdued">
          Suggested Action
        </Text>
        <Text variant="bodySm" as={"p"} tone="base">
          {capitalizeWords(chat.suggested_action)}
        </Text>
      </div>

      <div className="row">
        <Text variant="bodySm" as={"p"} tone="subdued">
          Rating
        </Text>
        <Text variant="bodySm" as={"p"} tone="base">
          {capitalizeWords(chat.rating)}
        </Text>
      </div>
    </section>
  );
};

const CustomerDetail = ({ chat }: ChatProps) => {
  const [open, toggle] = useState(false);

  if (!chat.customer) {
    return (
      <section>
        <div
          onClick={() => toggle(!open)}
          className="row"
          style={{ justifyContent: "space-between", marginBottom: "15px" }}
        >
          <Text variant="headingMd" as={"strong"} tone="base">
            Customer Summary
          </Text>
          <Icon source={open ? CaretDownIcon : CaretUpIcon} />
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
    tags,
    address,
  } = chat.customer;

  return (
    <section>
      <div
        onClick={() => toggle(!open)}
        className="row"
        style={{ justifyContent: "space-between", marginBottom: "15px" }}
      >
        <Text variant="headingMd" as={"strong"} tone="base">
          Customer Summary
        </Text>
        <Icon source={open ? CaretDownIcon : CaretUpIcon} />
      </div>

      {open && chat.customer ? (
        <div className="detail">
          <div className="row">
            <Text variant="bodySm" as={"p"} tone="subdued">
              Name
            </Text>
            <Text variant="bodySm" as={"p"} tone="base">
              {`${capitalizeWords(first_name)} ${capitalizeWords(last_name)}`}
            </Text>
          </div>

          <div
            className="row"
            style={{ cursor: "pointer" }}
            onClick={() => copyToClipboard(email)}
          >
            <Text variant="bodySm" as={"p"} tone="subdued">
              Email
            </Text>
            <Text variant="bodySm" as={"p"} tone="magic-subdued">
              {email}
            </Text>
          </div>

          <div className="row">
            <Text variant="bodySm" as={"p"} tone="subdued">
              ID
            </Text>
            <Text variant="bodySm" as={"p"} tone="base">
              {id}
            </Text>
          </div>

          <div className="row">
            <Text variant="bodySm" as={"p"} tone="subdued">
              Address
            </Text>
            <Text variant="bodySm" as={"p"} tone="base" breakWord>
              {address}
            </Text>
          </div>

          <div className="row">
            <Text variant="bodySm" as={"p"} tone="subdued">
              Tags
            </Text>
            <Text variant="bodySm" as={"p"} tone="base" breakWord>
              {tags}
            </Text>
          </div>

          <div className="row">
            <Text variant="bodySm" as={"p"} tone="subdued">
              Total Spent
            </Text>
            <Text variant="bodySm" as={"p"} tone="base" truncate>
              {`$${formatNumber(total_spent)}`}
            </Text>
          </div>

          <div className="row">
            <Text variant="bodySm" as={"p"} tone="subdued">
              Total Orders
            </Text>
            <Text variant="bodySm" as={"p"} tone="base" truncate>
              {total_orders}
            </Text>
          </div>
        </div>
      ) : null}
    </section>
  );
};

const OrderDetail = ({ chat }: ChatProps) => {
  const [open, toggle] = useState(false);

  if (!chat.order) {
    return (
      <section>
        <div
          onClick={() => toggle(!open)}
          className="row"
          style={{ justifyContent: "space-between", marginBottom: "15px" }}
        >
          <Text variant="headingMd" as={"strong"} tone="base">
            Customer Summary
          </Text>
          <Icon source={open ? CaretDownIcon : CaretUpIcon} />
        </div>
      </section>
    );
  }

  const {
    id,
    order_number,
    payment_status,
    fulfillment_status,
    total_price,
    created_at,
    line_items,
  } = chat.order;

  return (
    <section>
      <div
        onClick={() => toggle(!open)}
        className="row"
        style={{ justifyContent: "space-between", marginBottom: "15px" }}
      >
        <Text variant="headingMd" as={"strong"} tone="base">
          Order Summary
        </Text>
        <Icon source={open ? CaretDownIcon : CaretUpIcon} />
      </div>

      {open ? (
        <div className="detail">
          <div className="row">
            <Text variant="bodySm" as={"p"} tone="subdued">
              ID
            </Text>
            <Text variant="bodySm" as={"p"} tone="base">
              {id}
            </Text>
          </div>

          <div className="row">
            <Text variant="bodySm" as={"p"} tone="subdued">
              Order Number
            </Text>
            <Text variant="bodySm" as={"p"} tone="base">
              #{order_number}
            </Text>
          </div>

          <div className="row">
            <Text variant="bodySm" as={"p"} tone="subdued">
              Paid Status
            </Text>
            <Badge tone={"success"} size="small" progress={"complete"}>
              {capitalizeWords(payment_status)}
            </Badge>
          </div>

          <div className="row">
            <Text variant="bodySm" as={"p"} tone="subdued">
              Order Price
            </Text>
            <Text variant="bodySm" as={"p"} tone="base" truncate>
              {`$${formatNumber(Number(total_price))}`}
            </Text>
          </div>

          <div className="row">
            <Text variant="bodySm" as={"p"} tone="subdued">
              Fulfillment Status
            </Text>
            <Badge tone={"warning"} size="small" progress={"partiallyComplete"}>
              {capitalizeWords(fulfillment_status)}
            </Badge>
          </div>

          <div className="row">
            <Text variant="bodySm" as={"p"} tone="subdued">
              Placed At
            </Text>
            <Text variant="bodySm" as={"p"} tone="base" truncate>
              {formatTimestamp(created_at)}
            </Text>
          </div>

          <div className="row">
            <Text variant="bodySm" as={"p"} tone="subdued">
              Line Items
            </Text>
            <Text variant="bodySm" as={"p"} tone="base" breakWord>
              {line_items &&
                line_items.map((l) => {
                  return (
                    <>
                      {`${truncateString(l.title, 5)} x ${l.quantity} - ${l.options} 
                      `}{" "}
                      <br />
                    </>
                  );
                })}
            </Text>
          </div>
        </div>
      ) : null}
    </section>
  );
};
