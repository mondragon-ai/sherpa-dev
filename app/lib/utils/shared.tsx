import { useAppBridge } from "@shopify/app-bridge-react";
import { Dispatch, SetStateAction } from "react";

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

// export const handleHttpError = (
//     status: number,
//     message: string,
//     setError: Dispatch<SetStateAction<string | null>>,

//   ): void => {
//     switch (status) {
//       case 400:
//         toast.error(message);
//         setError(message);
//         return;
//       case 401:
//         console.log({401: message});
//         toast.error(message);
//         setError(message);
//         return;
//       case 403:
//         console.log({403: message});
//         toast.error(message);
//         setError(message);
//         return;
//       case 409:
//         toast.error(message);
//         setError(message);
//         return;
//       case 422:
//         toast.error(message);
//         setError(message);
//         return;
//       case 500:
//         toast.error(message);
//         setError(message);
//         return;
//       default:
//         toast.error("Uncaught Error");
//         setError("Uncaught Error");
//         return;
//     }
//   };
