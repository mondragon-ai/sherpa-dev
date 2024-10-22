import { useAppBridge } from "@shopify/app-bridge-react";

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
