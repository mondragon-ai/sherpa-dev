import {
  Icon,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonTabs,
  Text,
} from "@shopify/polaris";
import { CaretUpIcon } from "@shopify/polaris-icons";
import { Conversation } from "app/lib/types/chats";

export const SkeletonDetail = () => (
  <section>
    <SkeletonRow />
    <SkeletonRow title="Customer Summary" />
    <SkeletonRow title="Order Summary" />
  </section>
);

const SkeletonRow = ({ title }: { title?: string }) => (
  <>
    <style>
      {`
        .skelWrapper {
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


        .skelWrapper > .row,
        .skelWrapper > .detail > .row {
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

        .skelWrapper > .row > span,
        .skelWrapper > .detail > .row > span {
            margin: 0;
            cursor: pointer;
        }
        
        .skelWrapper > .row > span:hover,
        .skelWrapper > .detail > .row > span:hover {
            color: var(--p-color-bg-surface-tertiary-hover);
        }

        
        .skelWrapper > .row > p,
        .skelWrapper > .detail > .row > p  {
            width: 50%
        }

        `}
    </style>
    <section className="skelWrapper">
      {title && (
        <div
          className="row"
          style={{ justifyContent: "space-between", marginBottom: "15px" }}
        >
          <Text variant="headingMd" as={"strong"} tone="base">
            {title}
          </Text>
          <Icon source={CaretUpIcon} />
        </div>
      )}

      <div className="row" style={{ marginBottom: "15px" }}>
        <div style={{ width: "100%", padding: "0 5px 0 0" }}>
          <Text variant="bodySm" as={"p"} tone="subdued">
            <SkeletonBodyText lines={1} />
          </Text>
        </div>

        <div style={{ width: "100%", padding: "0 0px 0 5px" }}>
          <Text variant="bodySm" as={"p"} tone="base">
            <SkeletonBodyText lines={1} />
          </Text>
        </div>
      </div>

      <div className="row" style={{ marginBottom: "15px" }}>
        <div style={{ width: "100%", padding: "0 5px 0 0" }}>
          <Text variant="bodySm" as={"p"} tone="subdued">
            <SkeletonBodyText lines={1} />
          </Text>
        </div>

        <div style={{ width: "100%", padding: "0 0px 0 5px" }}>
          <Text variant="bodySm" as={"p"} tone="base">
            <SkeletonBodyText />
          </Text>
        </div>
      </div>

      <div className="row" style={{ marginBottom: "15px" }}>
        <div style={{ width: "100%", padding: "0 5px 0 0" }}>
          <Text variant="bodySm" as={"p"} tone="subdued">
            <SkeletonBodyText lines={1} />
          </Text>
        </div>

        <div style={{ width: "100%", padding: "0 0px 0 5px" }}>
          <Text variant="bodySm" as={"p"} tone="base">
            <SkeletonBodyText lines={1} />
          </Text>
        </div>
      </div>
    </section>
  </>
);

export const SkeletonConvo = () => {
  const agent_convo = {
    time: 0,
    is_note: false,
    message: "",
    sender: "agent",
    action: "opened",
  } as Conversation;

  return (
    <div className={"convoWrapper"}>
      <div className="actionText">
        <Text variant="bodySm" as={"p"} tone="magic">
          Customer opened a chat today
        </Text>
      </div>

      <div className="msgWrapper" style={{ alignItems: "flex-end" }}>
        <div className="msg" style={{ width: "50%" }}>
          <SkeletonBodyText />
        </div>
        <div style={{ width: "10%", marginTop: "10px" }}>
          <SkeletonBodyText lines={1} />
        </div>
      </div>
    </div>
  );
};

export const SkeletonHdr = () => {
  return (
    <header>
      <div style={{ width: "30%" }}>
        <SkeletonDisplayText />
      </div>
      <div className="hdrRigt">
        <SkeletonTabs count={2} />
      </div>
    </header>
  );
};
