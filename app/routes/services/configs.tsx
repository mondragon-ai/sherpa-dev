import { FetcherWithComponents } from "@remix-run/react";
import { ActionFetcherType } from "app/lib/types/shared";

/**
 * Handles the Order deletion.
 * @param {FetcherWithComponents} fetcher - The fetcher to submit the request.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setLoading - Function to set the loading state.
 * @param {React.Dispatch<React.SetStateAction<ErrorState | null>>} setError - Function to set the error state.
 */
export const saveConfigs = async (
  fetcher: FetcherWithComponents<ActionFetcherType>,
): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("action", "save");
    fetcher.submit(formData, { method: "POST" });
  } catch (error) {
    console.error("Error saving configs:", error);
  }
};
