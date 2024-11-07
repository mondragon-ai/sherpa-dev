import {
  saveRechargeToken,
  removeRechargeToken,
  startGmailOauth,
  removeGmailToken,
} from "app/routes/services/integrations";
import { useCallback, useEffect, useState } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { action } from "app/routes/app.integrate";
import { handleResponse } from "../utils/shared";
import { useFetcher } from "@remix-run/react";
import { FetcherProp } from "../types/shared";
import { AppTypes } from "../types/merchant";

export const useIntegrate = () => {
  const shopify = useAppBridge();
  const fetcher = useFetcher<typeof action>() as FetcherProp;
  const [apps, setApps] = useState<AppTypes[] | null>(null);
  const [error, setError] = useState({ message: "", type: "" });

  const isLoading =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";

  useEffect(() => {
    setError({ message: "", type: "" });
    if (fetcher.data) {
      switch (fetcher.data.type) {
        case "save_recharge": {
          setApps(
            (p) =>
              p && [
                ...p,
                {
                  name: "recharge",
                  token: "123",
                  refresh_token: "123",
                  email: "",
                  connected: true,
                  time: 100000000000,
                },
              ],
          );

          break;
        }
        case "remove_recharge": {
          const filterd = apps?.filter((a) => a.name !== "recharge");
          if (filterd) setApps(filterd);

          break;
        }
        case "save_gmail": {
          if (fetcher.data.data.url) {
            setApps(
              (p) =>
                p && [
                  ...p,
                  {
                    name: "gmail",
                    token: "123",
                    refresh_token: "123",
                    email: "",
                    connected: true,
                    time: 100000000000,
                  },
                ],
            );

            window.open(fetcher.data.data.url, "_blank");
          }

          break;
        }
        case "remove_gmail": {
          const filterd = apps?.filter((a) => a.name !== "gmail");
          if (filterd) setApps(filterd);

          break;
        }

        default:
          break;
      }
      handleResponse(fetcher.data, shopify, setError);
    }
  }, [fetcher.data]);

  // link recharge
  const handleRecahrgeSave = useCallback(
    async (token: string) => {
      saveRechargeToken(fetcher, token);
    },
    [fetcher.data],
  );

  // unlink recharge
  const handleRecahrgeRemove = useCallback(async () => {
    removeRechargeToken(fetcher);
  }, [fetcher.data]);

  // link gmail
  const handleLinkGmail = useCallback(async () => {
    startGmailOauth(fetcher);
  }, [fetcher, apps]);

  // unlink recharge
  const handleGmailRemove = useCallback(async () => {
    removeGmailToken(fetcher);
  }, [fetcher.data]);

  return {
    error,
    apps,
    isLoading,
    setError,
    setApps,
    handleRecahrgeSave,
    handleRecahrgeRemove,
    handleLinkGmail,
    handleGmailRemove,
  };
};
