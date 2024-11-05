import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { serverRequest } from "app/lib/networking/server";
import { authenticate } from "app/shopify.server";
import { fetchStore } from "../loaders/analytics";

/**
 * Action function for analytics Actions
 * @param {ActionFunctionArgs} args - The action function arguments.
 */
export async function analyticsAction({ request, params }: ActionFunctionArgs) {
  const { session, admin } = await authenticate.admin(request);
  const { shop, accessToken } = session;

  const store = await fetchStore(admin);
  const tz = store ? store.shop.ianaTimezone : "America/New_York";

  const formData = await request.formData();
  const type = formData.get("action");

  try {
    switch (type) {
      case "search": {
        const timeframe = formData.get("timeframe");
        const { message, status, data } = await serverRequest(
          "GET",
          `/store/${shop}/analytics/search?tz=${tz}&tf=${timeframe}`,
          null,
        );
        return json(
          {
            message: message,
            data: data.analytics,
            type: "search",
            status: status,
          },
          { status: status },
        );
      }

      default: {
        return json(
          { message: "uncaught Error", data: null, type: "", status: 400 },
          { status: 400 },
        );
      }
    }
  } catch (error) {
    console.error("Error handling action:", error);
    return json(
      { message: "uncaught Error", data: null, type: "", status: 500 },
      { status: 500 },
    );
  }
}
