import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { authenticate } from "app/shopify.server";

/**
 * Action function to handle order deletion.
 * @param {ActionFunctionArgs} args - The action function arguments.
 */
export async function configAction({ request, params }: ActionFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const { shop } = session;

  const formData = await request.formData();
  const type = formData.get("action");

  try {
    if (type === "save") {
      return json(
        { message: "Configs Saved", data: null, type: "save", status: 400 },
        { status: 400 },
      );
    }

    return json(
      { message: "uncaught Error", data: null, type: "", status: 400 },
      { status: 400 },
    );
  } catch (error) {
    console.error("Error handling action:", error);
    return json(
      { message: "uncaught Error", data: null, type: "", status: 500 },
      { status: 500 },
    );
  }
}
