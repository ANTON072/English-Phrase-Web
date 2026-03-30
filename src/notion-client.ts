import { Client } from "@notionhq/client";
import { parseNotionResults, type Phrase } from "./notion.js";

const notion = new Client({ auth: process.env["NOTION_API_KEY"] ?? "" });
const databaseId = process.env["NOTION_DATABASE_ID"] ?? "";

let cache: { phrases: Phrase[]; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000;

async function fetchAllFromNotion(): Promise<Phrase[]> {
  const results: unknown[] = [];
  let cursor: string | undefined = undefined;

  do {
    const response = await notion.databases.query({
      database_id: databaseId,
      ...(cursor ? { start_cursor: cursor } : {}),
    });
    results.push(...response.results);
    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return parseNotionResults(results);
}

export async function getPhrases(): Promise<Phrase[]> {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return cache.phrases;
  }
  const phrases = await fetchAllFromNotion();
  cache = { phrases, timestamp: Date.now() };
  return phrases;
}
