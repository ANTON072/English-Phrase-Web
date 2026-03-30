import { describe, it, expect } from "vitest";
import { parseNotionResults, pickRandom, type Phrase } from "../src/notion.js";

const mockNotionResults = [
  {
    properties: {
      単語: {
        type: "title",
        title: [{ plain_text: "apple" }],
      },
      意味: {
        type: "rich_text",
        rich_text: [{ plain_text: "りんご" }],
      },
      品詞: {
        type: "multi_select",
        multi_select: [{ name: "名詞" }],
      },
      例文: {
        type: "rich_text",
        rich_text: [{ plain_text: "I eat an apple." }],
      },
      例文訳: {
        type: "rich_text",
        rich_text: [{ plain_text: "私はりんごを食べる。" }],
      },
    },
  },
  {
    properties: {
      単語: {
        type: "title",
        title: [{ plain_text: "run" }],
      },
      意味: {
        type: "rich_text",
        rich_text: [{ plain_text: "走る" }],
      },
      品詞: {
        type: "multi_select",
        multi_select: [{ name: "動詞" }],
      },
      例文: {
        type: "rich_text",
        rich_text: [{ plain_text: "I run every morning." }],
      },
      例文訳: {
        type: "rich_text",
        rich_text: [{ plain_text: "私は毎朝走る。" }],
      },
    },
  },
  {
    properties: {
      単語: {
        type: "title",
        title: [],
      },
      意味: {
        type: "rich_text",
        rich_text: [],
      },
      品詞: {
        type: "multi_select",
        multi_select: [],
      },
      例文: {
        type: "rich_text",
        rich_text: [],
      },
      例文訳: {
        type: "rich_text",
        rich_text: [],
      },
    },
  },
];

describe("parseNotionResults", () => {
  it("Notionの結果をPhrase型に変換する", () => {
    const phrases = parseNotionResults(mockNotionResults);

    expect(phrases).toHaveLength(2);
    expect(phrases[0]).toEqual({
      word: "apple",
      meaning: "りんご",
      partOfSpeech: ["名詞"],
      example: "I eat an apple.",
      exampleTranslation: "私はりんごを食べる。",
    });
    expect(phrases[1]).toEqual({
      word: "run",
      meaning: "走る",
      partOfSpeech: ["動詞"],
      example: "I run every morning.",
      exampleTranslation: "私は毎朝走る。",
    });
  });

  it("単語が空のエントリはスキップする", () => {
    const phrases = parseNotionResults(mockNotionResults);
    expect(phrases.every((p) => p.word.length > 0)).toBe(true);
  });

  it("空の配列を渡すと空の配列を返す", () => {
    const phrases = parseNotionResults([]);
    expect(phrases).toEqual([]);
  });
});

describe("pickRandom", () => {
  it("配列からランダムに1つ選ぶ", () => {
    const phrases: Phrase[] = [
      {
        word: "apple",
        meaning: "りんご",
        partOfSpeech: ["名詞"],
        example: "I eat an apple.",
        exampleTranslation: "私はりんごを食べる。",
      },
      {
        word: "run",
        meaning: "走る",
        partOfSpeech: ["動詞"],
        example: "I run every morning.",
        exampleTranslation: "私は毎朝走る。",
      },
    ];
    const picked = pickRandom(phrases);
    expect(phrases).toContainEqual(picked);
  });
});
