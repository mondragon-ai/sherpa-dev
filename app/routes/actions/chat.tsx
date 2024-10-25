import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { serverRequest } from "app/lib/networking/server";
import { authenticate } from "app/shopify.server";

/**
 * Action function to handle order deletion.
 * @param {ActionFunctionArgs} args - The action function arguments.
 */
export async function chatAction({ request, params }: ActionFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const { shop, accessToken } = session;

  const formData = await request.formData();
  const type = formData.get("action");

  try {
    switch (type) {
      case "delete": {
        const id = formData.get("id");
        const { message, status } = await serverRequest(
          "DELETE",
          `/store/${shop}/chats/${id}`,
          null,
        );
        return json(
          { message: message, data: id, type: "delete", status: status },
          { status: status },
        );
      }
      case "note": {
        const payload = formData.get("note") as string;
        const { note, id } = JSON.parse(payload as string);
        const { message, status } = await serverRequest(
          "POST",
          `/store/${shop}/chats/${id}/note`,
          { note },
        );
        return json(
          { message: message, data: note, type: "note", status: status },
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
