import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { serverRequest } from "app/lib/networking/server";
import { authenticate } from "app/shopify.server";

/**
 * Action function to handle order deletion.
 * @param {ActionFunctionArgs} args - The action function arguments.
 */
export async function emailAction({ request, params }: ActionFunctionArgs) {
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
          `/store/${shop}/emails/${id}`,
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
          `/store/${shop}/emails/${id}/note`,
          { note },
        );
        return json(
          { message: message, data: note, type: "note", status: status },
          { status: status },
        );
      }

      case "resolve": {
        const payload = formData.get("payload") as string;
        const { type, email } = JSON.parse(payload as string);
        const { message, status } = await serverRequest(
          "POST",
          `/agents/${shop}/resolve/${email}?type=${type}`,
          null,
        );
        return json(
          { message: message, data: null, type: "resolve", status: status },
          { status: status },
        );
      }

      case "filter": {
        const query = formData.get("query") as string;
        const { message, status, data } = await serverRequest(
          "GET",
          `/store/${shop}/emails/search?type=${query}`,
          null,
        );
        return json(
          { message: message, data: data, type: "filter", status: status },
          { status: status },
        );
      }

      case "request": {
        const id = formData.get("id");
        const { message, status, data } = await serverRequest(
          "GET",
          `/store/${shop}/email/${id}`,
          null,
        );

        return json(
          { message: message, data: data, type: "request", status: status },
          { status: status },
        );
      }

      case "next": {
        const time = formData.get("time");
        const { message, status, data } = await serverRequest(
          "GET",
          `/store/${shop}/chats/next/${time}`,
          null,
        );

        return json(
          { message: message, data: data, type: "next", status: status },
          { status: status },
        );
      }

      case "send_email": {
        const payload = formData.get("payload") as string;
        const { to, subject, email } = JSON.parse(payload as string);
        const { message, status, data } = await serverRequest(
          "POST",
          `/apps/gmail/${shop}/email/send/email`,
          { to, subject, email },
        );

        return json(
          { message: message, data: data, type: "send_email", status: status },
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
