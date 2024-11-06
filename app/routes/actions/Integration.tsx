import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { serverRequest } from "app/lib/networking/server";
import { authenticate } from "app/shopify.server";

/**
 * Action function to handle app integrations.
 * @param {ActionFunctionArgs} args - The action function arguments.
 */
export async function IntegrationAction({
  request,
  params,
}: ActionFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const { shop, accessToken } = session;

  const formData = await request.formData();
  const type = formData.get("action");
  console.log(type);

  try {
    switch (type) {
      case "save_recharge": {
        const token = formData.get("token");
        if (!token) {
          return json(
            {
              message: "Could fetch Token",
              data: null,
              type: "save_recharge",
              status: 400,
            },
            { status: 400 },
          );
        }
        const { message, status, data } = await serverRequest(
          "POST",
          `/apps/recharge/${shop}/save/${token}`,
          null,
        );
        console.log({ message, status, data });
        return json(
          {
            message: message,
            data: null,
            type: "save_recharge",
            status: status,
          },
          { status: status },
        );
      }

      case "remove_recharge": {
        const { message, status } = await serverRequest(
          "DELETE",
          `/apps/recharge/${shop}/remove`,
          null,
        );
        return json(
          {
            message: message,
            data: null,
            type: "remove_recharge",
            status: status,
          },
          { status: status },
        );
      }

      case "save_gmail": {
        console.log("STRTING");
        const data = await serverRequest(
          "GET",
          `/apps/gmail/${shop}/auth`,
          null,
        );

        console.log(data);
        return json(
          {
            message: "started",
            data: data,
            type: "save_gmail",
            status: 200,
          },
          { status: 200 },
        );
      }

      case "remove_gmail": {
        const { message, status } = await serverRequest(
          "DELETE",
          `/apps/gmail/auth/${shop}/remove`,
          null,
        );
        return json(
          {
            message: message,
            data: null,
            type: "remove_gmail",
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
