import { json } from "@remix-run/node";
import { authenticate, USAGE_PLAN } from "../shopify.server";
import { NavMenu } from "@shopify/app-bridge-react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import type { HeadersFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Link,
  Outlet,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { SERVER_BASE_URL } from "app/lib/constants";
import { Card, Page, Text } from "@shopify/polaris";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const admin = await authenticate.admin(request);
  const { session, billing } = admin;

  await billing.require({
    plans: [USAGE_PLAN],
    isTest: true,
    onFailure: async () => billing.request({ plan: USAGE_PLAN, isTest: true }),
  });

  // const billingCheck = await billing.require({
  //   plans: [USAGE_PLAN],
  //   isTest: false,
  //   onFailure: async () => billing.request({ plan: USAGE_PLAN, isTest: false }),
  // });

  // await fetch(
  //   `${SERVER_BASE_URL}/store/${session.shop}/install/${session.accessToken}`,
  //   {
  //     method: "POST",
  //   },
  // );

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
  // return boundary.error(useRouteError());

  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <Page>
        <Card>
          <Text as="h1" variant="headingMd" tone="critical">
            {error.status} {error.statusText}
          </Text>
          <Text as="h1" variant="bodyMd" tone="critical">
            {error.data || "Something went wrong."}
          </Text>
          <Link to="/app">Go back to the dashboard</Link>
        </Card>
      </Page>
    );
  } else if (error instanceof Error) {
    return (
      <Page>
        <Card>
          <Text as="h1" variant="headingMd" tone="critical">
            {" "}
            Error
          </Text>
          <Text as="h1" variant="bodyMd" tone="critical">
            {error.message}
          </Text>
          <p>The stack trace is:</p>
          <pre>{error.stack}</pre>
          <Link to={"/app"}>Go back to the dashboard</Link>
        </Card>
      </Page>
    );
  } else {
    return (
      <Page>
        <Card>
          <Text as="h1" variant="headingMd" tone="critical">
            {" "}
            Unknown Error
          </Text>
          <Text as="h1" variant="bodyMd" tone="critical">
            An unexpected error occurred.
          </Text>
          <Link to="/app">Go back to the dashboard</Link>
        </Card>
      </Page>
    );
  }
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
