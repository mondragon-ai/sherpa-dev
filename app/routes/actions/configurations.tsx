import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { serverRequest } from "app/lib/networking/server";
import { authenticate } from "app/shopify.server";

/**
 * Action function to handle order deletion.
 * @param {ActionFunctionArgs} args - The action function arguments.
 */
export async function configAction({ request, params }: ActionFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const { shop, accessToken } = session;

  const formData = await request.formData();
  const type = formData.get("action");

  try {
    switch (type) {
      case "save": {
        const configurations = formData.get("configurations");
        console.log(configurations);
        if (!configurations) {
          return json(
            {
              message: "Could not parse",
              data: null,
              type: "save",
              status: 400,
            },
            { status: 400 },
          );
        }
        const { message, status, data } = await serverRequest(
          "POST",
          `/store/${shop}/configs`,
          { configurations: JSON.parse(String(configurations)) },
        );
        console.log({ message, status, data });
        return json(
          {
            message: message,
            data: null,
            type: "save",
            status: status,
          },
          { status: status },
        );
      }
      case "create": {
        const value = formData.get("value");
        const discounts = {
          discounts: { price: Number(value), token: accessToken },
        };
        const { message, status, data } = await serverRequest(
          "POST",
          `/store/${shop}/discounts`,
          discounts,
        );
        return json(
          {
            message: message,
            data: data.discount,
            type: "create",
            status: status,
          },
          { status: status },
        );
      }
      case "delete": {
        const id = formData.get("id");
        const { message, status } = await serverRequest(
          "DELETE",
          `/store/${shop}/discounts/${accessToken}?id=${id}`,
          null,
        );
        return json(
          { message: message, data: null, type: "delete", status: status },
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
