import { ShopifyGlobal, useAppBridge } from "@shopify/app-bridge-react";
import { Dispatch, SetStateAction } from "react";
import { ActionFetcherType } from "../types/shared";

export const copyToClipboard = async (text: string): Promise<boolean> => {
  const shopify = useAppBridge();
  if (!navigator.clipboard) {
    console.error("Clipboard API is not available");
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    console.log("Text copied to clipboard");
    shopify.toast.show("Copied");
    return true;
  } catch (err) {
    console.error("Failed to copy text: ", err);
    return false;
  }
};

export const delay = async (s: number) => {
  new Promise((resolve) => setTimeout(resolve, s));
};

/**
 * Handle the response from the Action API.
 * @param {ActionFetcherType} response - The response from the API.
 * @param {ShopifyGlobal} shopify - The Shopify app bridge instance.
 * @param {Dispatch<SetStateAction<{ message: string, type: string}>>} setError - The function to set the error state.
 */
export const handleResponse = (
  response: ActionFetcherType,
  shopify: ShopifyGlobal,
  setError: Dispatch<
    SetStateAction<{
      message: string;
      type: string;
    }>
  >,
) => {
  if (response.status > 300) {
    setError({
      message: response.message,
      type: response.type,
    });
  } else {
    shopify.toast.show(response.message);
  }
};
