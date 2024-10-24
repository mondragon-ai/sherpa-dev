import { saveConfigs } from "app/routes/services/configs";
import { useCallback, useEffect, useState } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { action } from "app/routes/app.configurations";
import { ConfigurationsType } from "../types/merchant";
import { handleResponse } from "../utils/shared";
import { useFetcher } from "@remix-run/react";
import { FetcherProp } from "../types/shared";

export const useConfigurations = (initialState: ConfigurationsType | null) => {
  const shopify = useAppBridge();
  const fetcher = useFetcher<typeof action>() as FetcherProp;
  const [config, setConfig] = useState<ConfigurationsType>(
    initialState || ({} as ConfigurationsType),
  );
  const [error, setError] = useState({ message: "", type: "" });

  const isLoading =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";

  useEffect(() => {
    setError({ message: "", type: "" });
    if (fetcher.data) {
      handleResponse(fetcher.data, shopify, setError);
    }
  }, [fetcher.data]);

  const handleSaveConfig = useCallback(async () => {
    await saveConfigs(fetcher);
  }, [fetcher, config]);

  return { config, error, isLoading, setConfig, setError, handleSaveConfig };
};
