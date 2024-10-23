import { DeleteIcon } from "@shopify/polaris-icons";
import { Button, Text } from "@shopify/polaris";
import { useState } from "react";

export const Accordion = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  const [open, toggle] = useState(false);

  return (
    <>
      <style>
        {`
            .accordian {
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;
                height: 100%;
                width: 100%;
                position: relative;
                margin: 0;
                padding: 0px;
                box-shadow: var(--p-shadow-100);
                border-radius: var(--p-border-radius-300);
            }
            
            .accordian > header {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                height: 50px;
                width: 100%;
                position: relative;
                margin: 0;
                padding: 10px;
                cursor: pointer;
            }

            .accordian > header:hover {
                background: var(--p-color-bg-surface-tertiary-hover);
                border-radius: var(--p-border-radius-300);
            }

            .accordian > main {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                height: auto;
                width: 100%;
                position: relative;
                margin: 0;
                padding: 10px;
            }

        `}
      </style>
      <div className="accordian" onClick={() => toggle(!open)}>
        <header style={{ borderBottom: open ? "none" : "" }}>
          <Text as="p" variant="bodyLg">
            {title}
          </Text>
          <Button variant="primary" tone="critical" icon={DeleteIcon}>
            Delete
          </Button>
        </header>
        {open && (
          <main>
            <Text as="p" variant="bodyMd">
              {description}
            </Text>
          </main>
        )}
      </div>
    </>
  );
};
