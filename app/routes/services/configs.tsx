import { FetcherWithComponents } from "@remix-run/react";
import { ConfigurationsType } from "app/lib/types/config";
import { ActionFetcherType } from "app/lib/types/shared";

/**
 * Handles the Order deletion.
 * @param {FetcherWithComponents} fetcher - The fetcher to submit the request.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setLoading - Function to set the loading state.
 * @param {React.Dispatch<React.SetStateAction<ErrorState | null>>} setError - Function to set the error state.
 */
export const saveConfigs = async (
  fetcher: FetcherWithComponents<ActionFetcherType>,
  payload: ConfigurationsType,
): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("action", "save");
    formData.append("configurations", JSON.stringify(payload));
    fetcher.submit(formData, { method: "POST" });
  } catch (error) {
    console.error("Error saving configs:", error);
  }
};

/**
 * Handles the Order deletion.
 * @param {FetcherWithComponents} fetcher - The fetcher to submit the request.
 * @param {{value: string}} value - The fetcher to submit the request.
 */
export const createDiscount = async (
  fetcher: FetcherWithComponents<ActionFetcherType>,
  value: string,
): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("action", "create");
    formData.append("value", value);
    fetcher.submit(formData, { method: "POST" });
  } catch (error) {
    console.error("Error creating discount:", error);
  }
};

/**
 * Handles the Order deletion.
 * @param {FetcherWithComponents} fetcher - The fetcher to submit the request.
 * @param {{value: string}} value - The fetcher to submit the request.
 */
export const deleteDiscount = async (
  fetcher: FetcherWithComponents<ActionFetcherType>,
  id: string,
): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("action", "delete");
    formData.append("id", id);
    fetcher.submit(formData, { method: "POST" });
  } catch (error) {
    console.error("Error deleting discount:", error);
  }
};
