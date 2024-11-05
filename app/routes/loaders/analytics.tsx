import { authenticate } from "app/shopify.server";
import { SERVER_BASE_URL } from "app/lib/constants";
import { ConfigurationsType } from "app/lib/types/config";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { ServicesReponseType, ShopInfoResponse } from "app/lib/types/shared";
import { AdminApiContext } from "@shopify/shopify-app-remix/server";

/**
 * Loader function to fetch analytics data
 * @param {LoaderFunctionArgs} args - The loader function arguments.
 */
export async function analyticsLoader({ request }: LoaderFunctionArgs) {
  const { session, admin } = await authenticate.admin(request);

  const store = await fetchStore(admin);
  const tz = store ? store.shop.ianaTimezone : "America/New_York";

  try {
    const response = await fetch(
      `${SERVER_BASE_URL}/store/${session.shop}/analytics?tz=${tz}`,
    );

    if (response.status == 422) {
      return json({
        shop: session.shop,
        analytics: null,
        message: "No analyitics",
      });
    }

    const { data, message } = (await response.json()) as ServicesReponseType;

    return json({
      shop: session.shop,
      analytics: data.analytics as ConfigurationsType,
      message: message,
    });
  } catch (error) {
    console.error("Error loading config data:", error);
    throw new Response("Failed to load config data", { status: 500 });
  }
}

export const fetchStore = async (admin: AdminApiContext<any>) => {
  const response = await admin.graphql(`
    query {
      shop {
        name
        currencyCode
        billingAddress {
          address1
          city
          provinceCode
          zip
        }
        ianaTimezone
      }
    }
  `);

  const data = await response.json();
  if (!data) return null;
  const shop = data.data as ShopInfoResponse;

  return shop;
};
