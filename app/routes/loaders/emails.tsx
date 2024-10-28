import { json, LoaderFunctionArgs } from "@remix-run/node";
import { SERVER_BASE_URL } from "app/lib/constants";
import { ChatDocument } from "app/lib/types/chats";
import { EmailDocument } from "app/lib/types/emails";
import { ServicesReponseType } from "app/lib/types/shared";
import { authenticate } from "app/shopify.server";

/**
 * Loader function to fetch chats list
 * @param {LoaderFunctionArgs} args - The loader function arguments.
 */
export async function emailsLoader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);

  try {
    const response = await fetch(
      `${SERVER_BASE_URL}/store/${session.shop}/emails`,
    );

    if (response.status == 422) {
      return json({
        shop: session.shop,
        emails: [],
        message: "No Chats",
      });
    }

    const { data, message } = (await response.json()) as ServicesReponseType;

    return json({
      shop: session.shop,
      emails: data as EmailDocument[],
      message: message,
    });
  } catch (error) {
    console.error("Error loading emails data:", error);
    throw new Response("Failed to load emails data", { status: 500 });
  }
}
