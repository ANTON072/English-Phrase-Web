import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Phrase } from "../src/notion.js";

const mockPhrases: Phrase[] = [
  {
    word: "apple",
    meaning: "りんご",
    partOfSpeech: ["名詞"],
    example: "I eat an apple.",
    exampleTranslation: "私はりんごを食べる。",
  },
];

const mockQuery = vi.fn();

vi.mock("@notionhq/client", () => ({
  Client: vi.fn().mockImplementation(() => ({
    databases: { query: mockQuery },
  })),
}));

beforeEach(() => {
  vi.resetModules();
  mockQuery.mockReset();
  mockQuery.mockResolvedValue({
    results: [
      {
        properties: {
          単語: { type: "title", title: [{ plain_text: "apple" }] },
          意味: { type: "rich_text", rich_text: [{ plain_text: "りんご" }] },
          品詞: { type: "multi_select", multi_select: [{ name: "名詞" }] },
          例文: { type: "rich_text", rich_text: [{ plain_text: "I eat an apple." }] },
          例文訳: { type: "rich_text", rich_text: [{ plain_text: "私はりんごを食べる。" }] },
        },
      },
    ],
    has_more: false,
    next_cursor: null,
  });
});

describe("getPhrases", () => {
  it("Notionからフレーズを取得して返す", async () => {
    const { getPhrases } = await import("../src/notion-client.js");
    const phrases = await getPhrases();
    expect(phrases).toHaveLength(1);
    expect(phrases[0]?.word).toBe("apple");
    expect(mockQuery).toHaveBeenCalledTimes(1);
  });

  it("2回目の呼び出しではキャッシュを返す", async () => {
    const { getPhrases } = await import("../src/notion-client.js");
    await getPhrases();
    await getPhrases();
    expect(mockQuery).toHaveBeenCalledTimes(1);
  });
});
