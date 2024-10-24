import { json } from "@remix-run/node";
import { authenticate, USAGE_PLAN } from "../shopify.server";
import { NavMenu } from "@shopify/app-bridge-react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import type { HeadersFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { SERVER_BASE_URL } from "app/lib/constants";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const admin = await authenticate.admin(request);
  const { session, billing } = admin;

  await billing.require({
    plans: [USAGE_PLAN],
    isTest: true,
    onFailure: async () => billing.request({ plan: USAGE_PLAN, isTest: true }),
  });

  // const subscription = billingCheck.appSubscriptions[0];

  await fetch(
    `${SERVER_BASE_URL}/store/${session.shop}/install/${session.accessToken}`,
    {
      method: "POST",
    },
  );

  return json({ apiKey: process.env.SHOPIFY_API_KEY || "" });
};

export default function App() {
  const { apiKey } = useLoaderData<typeof loader>();

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <NavMenu>
        <Link to="/app" rel="home">
          Home
        </Link>
        <Link to="/app/emails">Emails</Link>
        <Link to="/app/configurations">Configurations</Link>
        <Link to="/app/integrate">Integrate</Link>
        <Link to="/app/analytics">Analytics</Link>
      </NavMenu>
      <Outlet />
    </AppProvider>
  );
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
