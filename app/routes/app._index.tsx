import { chatsLoader } from "./loaders/chats";
import { Page, Grid } from "@shopify/polaris";
import { Chat } from "app/components/home/Chat";
import { useLoaderData } from "@remix-run/react";
import { ChatDocument } from "app/lib/types/chats";
import { ChatList } from "app/components/home/ChatList";
import { useCallback, useEffect, useState } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { ChatDetail } from "app/components/home/ChatDetail";

export const loader = chatsLoader;

// export const action = async ({ request }: ActionFunctionArgs) => {
//   const { admin } = await authenticate.admin(request);
//   const color = ["Red", "Orange", "Yellow", "Green"][
//     Math.floor(Math.random() * 4)
//   ];
//   const response = await admin.graphql(
//     `#graphql
//       mutation populateProduct($input: ProductInput!) {
//         productCreate(input: $input) {
//           product {
//             id
//             title
//             handle
//             status
//             variants(first: 10) {
//               edges {
//                 node {
//                   id
//                   price
//                   barcode
//                   createdAt
//                 }
//               }
//             }
//           }
//         }
//       }`,
//     {
//       variables: {
//         input: {
//           title: `${color} Snowboard`,
//         },
//       },
//     },
//   );
//   const responseJson = await response.json();

//   const product = responseJson.data!.productCreate!.product!;
//   const variantId = product.variants.edges[0]!.node!.id!;

//   const variantResponse = await admin.graphql(
//     `#graphql
//     mutation shopifyRemixTemplateUpdateVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
//       productVariantsBulkUpdate(productId: $productId, variants: $variants) {
//         productVariants {
//           id
//           price
//           barcode
//           createdAt
//         }
//       }
//     }`,
//     {
//       variables: {
//         productId: product.id,
//         variants: [{ id: variantId, price: "100.00" }],
//       },
//     },
//   );

//   const variantResponseJson = await variantResponse.json();

//   return json({
//     product: responseJson!.data!.productCreate!.product,
//     variant:
//       variantResponseJson!.data!.productVariantsBulkUpdate!.productVariants,
//   });
// };

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const [fetching, setFetch] = useState(true);
  const [chat, setChat] = useState<null | ChatDocument>(null);
  const [chats, setChats] = useState<ChatDocument[]>([]);
  // const fetcher = useFetcher<typeof action>();

  const shopify = useAppBridge();
  // const isLoading =
  //   ["loading", "submitting"].includes(fetcher.state) &&
  //   fetcher.formMethod === "POST";
  // const productId = fetcher.data?.product?.id.replace(
  //   "gid://shopify/Product/",
  //   "",
  // );
  // const generateProduct = () => fetcher.submit({}, { method: "POST" });

  useEffect(() => {
    if (data) {
      setChats(data.chats as unknown as ChatDocument[]);
      shopify.toast.show(data.message);
      setFetch(false);
    }
  }, [data, shopify]);
  console.log(data);

  const handleFetchChat = useCallback((id: string) => {
    const selected = chats.find((c) => c.id == id);
    if (selected) setChat(selected);
  }, []);

  return (
    <Page
      fullWidth
      title="Customer Chats"
      subtitle="Last Updated: Oct 21, 24 2:00 PM"
    >
      <Grid columns={{ sm: 3 }}>
        <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 3, xl: 3 }}>
          <Placeholder>
            <ChatList
              chat_list={chats}
              id={chat ? chat.id : ""}
              handleFetchChat={handleFetchChat}
            />
          </Placeholder>
        </Grid.Cell>
        <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 6, xl: 6 }}>
          <Placeholder>
            <Chat chat={chat} setChat={setChat} />
          </Placeholder>
        </Grid.Cell>
        <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 3, xl: 3 }}>
          <Placeholder>
            <ChatDetail chat={chat} />
          </Placeholder>
        </Grid.Cell>
      </Grid>
    </Page>
  );
}

const Placeholder = ({ children }: { children: JSX.Element }) => {
  return (
    <>
      <style>{`
        .homeCardWrapper {
          height: 85vh;
          width: 100%;
          position: relative;
          margin: 0;
          padding: 0;
          background: var(--p-color-bg-surface);
          border-radius: var(--p-border-radius-300);
          box-shadow: var(--p-shadow-100);
        }
      `}</style>
      <div className={"homeCardWrapper"}>{children}</div>
    </>
  );
};
