import { authenticate } from "app/shopify.server";
import { SERVER_BASE_URL } from "app/lib/constants";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { ServicesReponseType } from "app/lib/types/shared";
import { AppTypes } from "app/lib/types/merchant";

/**
 * Loader function to fetch configurations data
 * @param {LoaderFunctionArgs} args - The loader function arguments.
 */
export async function integrationLoader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);

  try {
    const response = await fetch(
      `${SERVER_BASE_URL}/store/${session.shop}/integrations`,
    );

    if (response.status == 422) {
      return json({
        shop: session.shop,
        apps: null,
        message: "No Merchant",
      });
    }

    const { data, message } = (await response.json()) as ServicesReponseType;

    return json({
      shop: session.shop,
      apps: data.apps as AppTypes[],
      message: message,
    });
  } catch (error) {
    console.error("Error loading config data:", error);
    throw new Response("Failed to load config data", { status: 500 });
  }
}
