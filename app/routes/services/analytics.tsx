import { FetcherWithComponents } from "@remix-run/react";
import { TimeFrameTypes } from "app/lib/types/analytics";
import { ConfigurationsType } from "app/lib/types/config";
import { ActionFetcherType } from "app/lib/types/shared";

/**
 * Handles the Fetching analytics by TF.
 * @param {FetcherWithComponents} fetcher - The fetcher to submit the request.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setLoading - Function to set the loading state.
 * @param {React.Dispatch<React.SetStateAction<ErrorState | null>>} setError - Function to set the error state.
 */
export const fetchSearchedAnalytics = async (
  fetcher: FetcherWithComponents<ActionFetcherType>,
  tf: TimeFrameTypes,
): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("action", "search");
    formData.append("timeframe", tf);
    fetcher.submit(formData, { method: "POST" });
  } catch (error) {
    console.error("Error fetching analytics:", error);
  }
};
