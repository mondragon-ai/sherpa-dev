import { BlockStack, Box, Card, Grid, Text, TextField } from "@shopify/polaris";
import { ConfigurationsType } from "app/lib/types/config";
import { Dispatch, SetStateAction, useCallback } from "react";

export const EmailSignature = ({
  config,
  setConfig,
}: {
  config: ConfigurationsType;
  setConfig: Dispatch<SetStateAction<ConfigurationsType>>;
}) => {
  const handleTextChange = useCallback(
    (
      v: string,
      t:
        | "company"
        | "name"
        | "logo"
        | "facebook"
        | "twitter"
        | "tiktok"
        | "youtube"
        | "instagram",
    ) =>
      setConfig((p) => ({
        ...p,
        email_signature: { ...p.email_signature, [t]: v },
      })),
    [config],
  );
  return (
    <>
      <style>
        {`

        .emailWrapper {
            position: relative;
            width: 100%;
            height: auto;
            padding: 0rem 0;
            margin: 0;
            margin-top: 20px;
            flex-direction: row !important;
            justify-content: flex-start !important;
            align-items: center !important;
            display: flex !important;
        }
        .logoWrapper {
            width: 15%;
            height: auto;
            padding: 10px;
            margin: 0;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
        }
        .logoWrapper > img {
            width: 100%;
            height: auto;
            border-radius: 10px;
            object-fit: contain;
        }
        .dividerWrapper {
            width: 2px;
            display: flex;
            flex-direction: row;
            justify-content: center !important;
            align-items: center !important;
            margin-right: 10px;
        }
        .dividerWrapper > div {
            width: 1px;
            height: 100px;
            background-color: rgb(218, 218, 218);
        }
        .h6Txt {
            font-family: sans-serif;
            font-size: 13px;
            line-height: 20px;
            font-weight: 500;
            margin: 0 0 10px 0;
            margin-bottom: 0;
        }
        .link {
            color: #333;
            text-decoration: none;
            font-family: sans-serif;
            font-size: 12px;
            line-height: 18px;
            font-weight: 400;
        }
        .spanTxt {
            color: #333;
            text-decoration: none;
            font-family: sans-serif;
            font-size: 12px;
            line-height: 18px;
            font-weight: 400;
        }
        .socialWrapper {
            width: 100%;
            height: auto;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            margin: 0;
            padding: 10px 0;
        }
        .social {
            width: 25px;
            height: 25px;
            border-radius: 4px;
            margin-right: 5px;
        }
        .social > img {
            object-fit: contain;
            width: 25px;
            height: 25px;
        }

    `}
      </style>
      <Grid columns={{ sm: 3 }}>
        <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 4, xl: 4 }}>
          <Box as="section">
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">
                Email Signature
              </Text>
              <Text as="p" variant="bodyMd">
                This is wher eyou stylize the email signautre so that you the
                customer service emails have a tailored experience to match your
                store.
              </Text>
            </BlockStack>
          </Box>
        </Grid.Cell>
        <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 8, xl: 8 }}>
          <Card roundedAbove="sm">
            <Text as="h2" variant="headingSm">
              Signature Preview
            </Text>
            <div className="emailWrapper">
              <div className="logoWrapper">
                <img
                  src={
                    config?.email_signature?.logo ||
                    "https://cdn.shopify.com/s/files/1/0783/4802/6165/files/bigly.png?v=1727644792"
                  }
                  alt="logo"
                />
              </div>

              <div className="dividerWrapper">
                <div></div>
              </div>
              <div className="textWrapper">
                <h6 className="h6Txt">
                  <strong>
                    {config?.email_signature?.name || "Philly Harris"}
                  </strong>
                </h6>
                <h6 style={{ color: "#777", marginBottom: "10px" }}>
                  Customer Service Agent
                  <br />
                </h6>
                <a className="link" href={`mailto:${config.contact_email}`}>
                  {config.contact_email}
                </a>
                <br />
                <span className="spanTxt">
                  {config?.email_signature?.company || "< Company Name > "}
                </span>
                <br />
                <div className="socialWrapper">
                  {config?.email_signature?.facebook && (
                    <a
                      className="social"
                      href={config?.email_signature?.facebook}
                    >
                      <img
                        src="https://cdn.shopify.com/s/files/1/0783/4802/6165/files/instagram_1384015.png?v=1731015538"
                        alt="fb"
                      />
                    </a>
                  )}
                  {config?.email_signature?.tiktok && (
                    <a
                      className="social"
                      href={config?.email_signature?.tiktok}
                    >
                      <img
                        src="https://cdn.shopify.com/s/files/1/0783/4802/6165/files/tiktok_3116491.png?v=1731015538"
                        alt="TT"
                      />
                    </a>
                  )}
                  {config?.email_signature?.twitter && (
                    <a
                      className="social"
                      href={config?.email_signature?.twitter}
                    >
                      <img
                        src="https://cdn.shopify.com/s/files/1/0783/4802/6165/files/x-icon.png?v=1731015628"
                        alt="x"
                      />
                    </a>
                  )}
                  {config?.email_signature?.instagram && (
                    <a
                      className="social"
                      href={config?.email_signature?.instagram}
                    >
                      <img
                        src="https://cdn.shopify.com/s/files/1/0783/4802/6165/files/instagram_1384015.png?v=1731015538"
                        alt="ig"
                      />
                    </a>
                  )}
                  {config?.email_signature?.youtube && (
                    <a
                      className="social"
                      href={config?.email_signature?.youtube}
                    >
                      <img
                        src="https://cdn.shopify.com/s/files/1/0783/4802/6165/files/yt-icon.png?v=1731015628"
                        alt="YT"
                      />
                    </a>
                  )}
                </div>
              </div>
            </div>
            <Box paddingBlockStart="300">
              <Grid columns={{ sm: 3 }}>
                <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 6, xl: 6 }}>
                  <TextField
                    label="Customer Service Agent Name"
                    value={config?.email_signature?.name || ""}
                    onChange={(v) => handleTextChange(v, "name")}
                    error=""
                    placeholder="Philly Harris"
                    type="text"
                    autoComplete="off"
                  />
                </Grid.Cell>

                <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 6, xl: 6 }}>
                  <TextField
                    label="Store Name"
                    value={config?.email_signature?.company || ""}
                    onChange={(v) => handleTextChange(v, "company")}
                    error=""
                    placeholder="Store Name..."
                    type="text"
                    autoComplete="off"
                  />
                </Grid.Cell>
              </Grid>

              <TextField
                label="Store Logo"
                value={config?.email_signature?.logo || ""}
                onChange={(v) => handleTextChange(v, "logo")}
                error=""
                placeholder="https://cdn.shopify.com/logo"
                type="text"
                autoComplete="off"
              />
              <TextField
                label="Facebook Link"
                value={config?.email_signature?.facebook || ""}
                onChange={(v) => handleTextChange(v, "facebook")}
                error=""
                placeholder="https://facebook.com"
                type="text"
                autoComplete="off"
              />
              <TextField
                label="Twitter (X) Link"
                value={config?.email_signature?.twitter || ""}
                onChange={(v) => handleTextChange(v, "twitter")}
                error=""
                placeholder="https://x.com"
                type="text"
                autoComplete="off"
              />
              <TextField
                label="TikTok Link"
                value={config?.email_signature?.tiktok || ""}
                onChange={(v) => handleTextChange(v, "tiktok")}
                error=""
                placeholder="https://tiktok.com"
                type="text"
                autoComplete="off"
              />
              <TextField
                label="Instagram Link"
                value={config?.email_signature?.instagram || ""}
                onChange={(v) => handleTextChange(v, "instagram")}
                error=""
                placeholder="https://instagram.com"
                type="text"
                autoComplete="off"
              />
              <TextField
                label="YouTube Link"
                value={config?.email_signature?.youtube || ""}
                onChange={(v) => handleTextChange(v, "youtube")}
                error=""
                placeholder="https://youtube.com"
                type="text"
                autoComplete="off"
              />
            </Box>
          </Card>
        </Grid.Cell>
      </Grid>
    </>
  );
};
