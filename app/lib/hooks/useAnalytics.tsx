import { useCallback, useEffect, useState } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { AnalyticsDocument, TimeFrameTypes } from "../types/analytics";
import { handleResponse } from "../utils/shared";
import { useFetcher } from "@remix-run/react";
import { FetcherProp } from "../types/shared";
import { fetchSearchedAnalytics } from "app/routes/services/analytics";
import { action } from "app/routes/app.analytics";

export const useAnalytics = () => {
  const shopify = useAppBridge();
  const fetcher = useFetcher<typeof action>() as FetcherProp;
  const [analytics, setAnalytics] = useState<AnalyticsDocument[] | null>(null);
  const [error, setError] = useState({ message: "", type: "" });

  const isLoading =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";

  useEffect(() => {
    setError({ message: "", type: "" });
    if (fetcher.data) {
      switch (fetcher.data.type) {
        case "search": {
          if (fetcher.data.status < 300 && fetcher.data.type == "search") {
            setAnalytics(fetcher.data.data as unknown as AnalyticsDocument[]);
          }
        }
        default:
          break;
      }
      handleResponse(fetcher.data, shopify, setError);
    }
  }, [fetcher.data]);

  const handleSearch = useCallback(
    (tf: TimeFrameTypes) => {
      console.log(tf);
      fetchSearchedAnalytics(fetcher, tf);
    },
    [analytics],
  );

  return {
    error,
    isLoading,
    analytics,
    setAnalytics,
    handleSearch,
    setError,
  };
};
