import {
  createDiscount,
  deleteDiscount,
  saveConfigs,
} from "app/routes/services/configs";
import { useCallback, useEffect, useState } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { action } from "app/routes/app.configurations";
import { handleResponse } from "../utils/shared";
import { useFetcher } from "@remix-run/react";
import { FetcherProp } from "../types/shared";
import { ConfigurationsType } from "../types/config";

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
      switch (fetcher.data.type) {
        case "create": {
          setConfig((p) => ({
            ...p,
            price_rules: { ...p.price_rules, id: fetcher.data?.data.id },
          }));
          break;
        }
        case "delete": {
          setConfig((p) => ({
            ...p,
            price_rules: { ...p.price_rules, id: "" },
          }));
          break;
        }
        default:
          break;
      }
      handleResponse(fetcher.data, shopify, setError);
    }
  }, [fetcher.data]);

  // Update
  const handleSaveConfig = useCallback(async () => {
    await saveConfigs(fetcher, config);
  }, [fetcher, config]);

  // Create Discount
  const handleCreateDiscount = useCallback(
    async (value: string) => {
      await createDiscount(fetcher, value);
    },
    [fetcher, config],
  );

  // Delete Discount
  const handleDeleteDiscount = useCallback(
    async (id: string) => {
      await deleteDiscount(fetcher, id);
    },
    [fetcher, config],
  );

  return {
    config,
    error,
    isLoading,
    setConfig,
    setError,
    handleSaveConfig,
    handleCreateDiscount,
    handleDeleteDiscount,
  };
};
