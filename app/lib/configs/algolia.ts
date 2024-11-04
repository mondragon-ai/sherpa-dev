import { algoliasearch } from "algoliasearch";
import { createCurrentSeconds } from "../utils/converters/time";

type AlgoliaIndexTypes = "sherpa_chats" | "sherpa_emails";
const client = algoliasearch("UPRAWCOIS2", "527c18f3b7b71cf3626fe97c53083f75");

export const fetchSearchResults = async (
  query: string,
  domain: string,
  index: AlgoliaIndexTypes,
) => {
  if (!query) return [];

  try {
    const { results } = await client.search({
      requests: [
        {
          indexName: `${domain}_${index}`,
          query: query,
          hitsPerPage: 50,
        },
      ],
    });

    const list: any[] = (results[0] as any).hits || [];
    const items = [];
    if (list) {
      const time = createCurrentSeconds();
      for (const s of list) {
        items.push({
          ...s,
          customer: { first_name: s.first_name, last_name: s.lasst_name },
          time: time,
        });
      }
    }

    return items;
  } catch (error) {
    console.error("Error fetching search results:", error);
  }
  return [];
};
