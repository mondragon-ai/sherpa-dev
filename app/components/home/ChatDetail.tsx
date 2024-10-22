import { Badge, Icon, Text } from "@shopify/polaris";
import { capitalizeWords } from "app/lib/utils/converters/text";
import { CaretDownIcon, CaretUpIcon } from "@shopify/polaris-icons";
import { formatTimestamp } from "app/lib/utils/converters/time";
import { useState } from "react";
import { copyToClipboard } from "app/lib/utils/shared";

export const ChatDetail = () => {
  return (
    <>
      <style>{`
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

    `}</style>
      <div className={"detailWrapper"}>
        <header>
          <Text variant="headingLg" as={"strong"}>
            Details
          </Text>
        </header>
        <div className="detailMain">
          <ChatDetails />
          <CustomerDetail />
          <OrderDetail />
        </div>
      </div>
    </>
  );
};

const ChatDetails = () => {
  return (
    <section>
      <div className="row">
        <Text variant="bodySm" as={"p"} tone="subdued">
          Inquiry
        </Text>
        <Text variant="bodySm" as={"p"} tone="base">
          Status
        </Text>
      </div>

      <div className="row">
        <Text variant="bodySm" as={"p"} tone="subdued">
          Status
        </Text>
        <Badge tone={"warning"} size="small" progress={"partiallyComplete"}>
          {capitalizeWords("open")}
        </Badge>
      </div>

      <div className="row">
        <Text variant="bodySm" as={"p"} tone="subdued">
          Suggested Action
        </Text>
        <Text variant="bodySm" as={"p"} tone="base">
          Resolve
        </Text>
      </div>

      <div className="row">
        <Text variant="bodySm" as={"p"} tone="subdued">
          Rating
        </Text>
        <Text variant="bodySm" as={"p"} tone="base">
          Positive
        </Text>
      </div>
    </section>
  );
};

const CustomerDetail = () => {
  const [open, toggle] = useState(false);
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

      {open ? (
        <div className="detail">
          <div className="row">
            <Text variant="bodySm" as={"p"} tone="subdued">
              Name
            </Text>
            <Text variant="bodySm" as={"p"} tone="base">
              First & Last Name
            </Text>
          </div>

          <div
            className="row"
            style={{ cursor: "pointer" }}
            onClick={() => copyToClipboard("email@email.com")}
          >
            <Text variant="bodySm" as={"p"} tone="subdued">
              Email
            </Text>
            <Text variant="bodySm" as={"p"} tone="magic-subdued">
              email@email.com
            </Text>
          </div>

          <div className="row">
            <Text variant="bodySm" as={"p"} tone="subdued">
              ID
            </Text>
            <Text variant="bodySm" as={"p"} tone="base">
              12345
            </Text>
          </div>

          <div className="row">
            <Text variant="bodySm" as={"p"} tone="subdued">
              Address
            </Text>
            <Text variant="bodySm" as={"p"} tone="base" breakWord>
              249 Saddlebrook Dr SE, Calhoun, United States 30701
            </Text>
          </div>

          <div className="row">
            <Text variant="bodySm" as={"p"} tone="subdued">
              Tags
            </Text>
            <Text variant="bodySm" as={"p"} tone="base" breakWord>
              Active Subscriber, Login with Shop, PS-Accepts-SMS, Shop
            </Text>
          </div>

          <div className="row">
            <Text variant="bodySm" as={"p"} tone="subdued">
              Total Spent
            </Text>
            <Text variant="bodySm" as={"p"} tone="base" truncate>
              $999.99
            </Text>
          </div>

          <div className="row">
            <Text variant="bodySm" as={"p"} tone="subdued">
              Total Orders
            </Text>
            <Text variant="bodySm" as={"p"} tone="base" truncate>
              99
            </Text>
          </div>
        </div>
      ) : null}
    </section>
  );
};

const OrderDetail = () => {
  const [open, toggle] = useState(false);
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
              12345
            </Text>
          </div>

          <div className="row">
            <Text variant="bodySm" as={"p"} tone="subdued">
              Order Number
            </Text>
            <Text variant="bodySm" as={"p"} tone="base">
              #1234
            </Text>
          </div>

          <div className="row">
            <Text variant="bodySm" as={"p"} tone="subdued">
              Paid Status
            </Text>
            <Badge tone={"success"} size="small" progress={"complete"}>
              {capitalizeWords("Paid")}
            </Badge>
          </div>

          <div className="row">
            <Text variant="bodySm" as={"p"} tone="subdued">
              Order Price
            </Text>
            <Text variant="bodySm" as={"p"} tone="base" truncate>
              $42.00
            </Text>
          </div>

          <div className="row">
            <Text variant="bodySm" as={"p"} tone="subdued">
              Fulfillment Status
            </Text>
            <Badge tone={"warning"} size="small" progress={"partiallyComplete"}>
              {capitalizeWords("hold")}
            </Badge>
          </div>

          <div className="row">
            <Text variant="bodySm" as={"p"} tone="subdued">
              Placed At
            </Text>
            <Text variant="bodySm" as={"p"} tone="base" truncate>
              {formatTimestamp(1729606409)}
            </Text>
          </div>

          <div className="row">
            <Text variant="bodySm" as={"p"} tone="subdued">
              Line Items
            </Text>
            <Text variant="bodySm" as={"p"} tone="base" breakWord>
              - VIP Club x 1 <br />
              - VIP Club x 1 <br />
              - VIP Club x 1 <br />
            </Text>
          </div>
        </div>
      ) : null}
    </section>
  );
};
