import { authenticate } from "app/shopify.server";
import { SERVER_BASE_URL } from "app/lib/constants";
import { ConfigurationsType } from "app/lib/types/config";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { ServicesReponseType } from "app/lib/types/shared";

/**
 * Loader function to fetch configurations data
 * @param {LoaderFunctionArgs} args - The loader function arguments.
 */
export async function configurationsLoader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);

  try {
    const response = await fetch(
      `${SERVER_BASE_URL}/store/${session.shop}/configs`,
    );

    if (response.status == 422) {
      return json({
        shop: session.shop,
        configs: null,
        message: "No Merchant",
      });
    }

    const { data, message } = (await response.json()) as ServicesReponseType;

    return json({
      shop: session.shop,
      configs: data.configs as ConfigurationsType,
      message: message,
    });
  } catch (error) {
    console.error("Error loading config data:", error);
    throw new Response("Failed to load config data", { status: 500 });
  }
}
