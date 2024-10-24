import { json, LoaderFunctionArgs } from "@remix-run/node";
import { SERVER_BASE_URL } from "app/lib/constants";
import { ChatDocument } from "app/lib/types/chats";
import { ServicesReponseType } from "app/lib/types/shared";
import { authenticate } from "app/shopify.server";

/**
 * Loader function to fetch chats list
 * @param {LoaderFunctionArgs} args - The loader function arguments.
 */
export async function chatsLoader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);

  try {
    const response = await fetch(
      `${SERVER_BASE_URL}/store/${session.shop}/chats`,
    );

    if (response.status == 422) {
      return json({
        shop: session.shop,
        chats: [],
        message: "No Chats",
      });
    }

    const { data, message } = (await response.json()) as ServicesReponseType;

    return json({
      shop: session.shop,
      chats: data.chats as ChatDocument[],
      message: message,
    });
  } catch (error) {
    console.error("Error loading chat data:", error);
    throw new Response("Failed to load chat data", { status: 500 });
  }
}
