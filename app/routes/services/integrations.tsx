import { FetcherWithComponents } from "@remix-run/react";
import { ConfigurationsType } from "app/lib/types/config";
import { ActionFetcherType } from "app/lib/types/shared";

/**
 * Handles saving recharge token.
 * @param {FetcherWithComponents} fetcher - The fetcher to submit the request.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setLoading - Function to set the loading state.
 * @param {React.Dispatch<React.SetStateAction<ErrorState | null>>} setError - Function to set the error state.
 */
export const saveRechargeToken = async (
  fetcher: FetcherWithComponents<ActionFetcherType>,
  token: string,
): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("action", "save_recharge");
    formData.append("token", token);
    fetcher.submit(formData, { method: "POST" });
  } catch (error) {
    console.error("Error saving recharge token:", error);
  }
};

/**
 * Handles the recharge deletion.
 * @param {FetcherWithComponents} fetcher - The fetcher to submit the request.
 * @param {{value: string}} value - The fetcher to submit the request.
 */
export const removeRechargeToken = async (
  fetcher: FetcherWithComponents<ActionFetcherType>,
): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("action", "remove_recharge");
    fetcher.submit(formData, { method: "POST" });
  } catch (error) {
    console.error("Error removing recharge:", error);
  }
};

/**
 * Handles saving gmail token.
 * @param {FetcherWithComponents} fetcher - The fetcher to submit the request.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setLoading - Function to set the loading state.
 * @param {React.Dispatch<React.SetStateAction<ErrorState | null>>} setError - Function to set the error state.
 */
export const startGmailOauth = async (
  fetcher: FetcherWithComponents<ActionFetcherType>,
): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("action", "save_gmail");
    fetcher.submit(formData, { method: "POST" });
  } catch (error) {
    console.error("Error saving gmail token:", error);
  }
};

/**
 * Handles the gmail deletion.
 * @param {FetcherWithComponents} fetcher - The fetcher to submit the request.
 * @param {{value: string}} value - The fetcher to submit the request.
 */
export const removeGmailToken = async (
  fetcher: FetcherWithComponents<ActionFetcherType>,
): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("action", "remove_gmail");
    fetcher.submit(formData, { method: "POST" });
  } catch (error) {
    console.error("Error removing gmail:", error);
  }
};
