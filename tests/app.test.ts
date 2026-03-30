import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../src/notion-client.js", () => ({
  getPhrases: vi.fn().mockResolvedValue([
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
  ]),
}));

import { app } from "../src/app.js";

describe("GET /api/phrase", () => {
  it("200でPhraseのJSONを返す", async () => {
    const res = await app.request("/api/phrase");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty("word");
    expect(json).toHaveProperty("meaning");
    expect(json).toHaveProperty("partOfSpeech");
    expect(json).toHaveProperty("example");
    expect(json).toHaveProperty("exampleTranslation");
  });

  it("返されるフレーズはモックデータに含まれる", async () => {
    const res = await app.request("/api/phrase");
    const json = await res.json();
    expect(["apple", "run"]).toContain(json.word);
  });
});

describe("GET /", () => {
  it("200でHTMLを返す", async () => {
    const res = await app.request("/");
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/html");
  });

  it("HTMLにクイズUIの要素が含まれる", async () => {
    const res = await app.request("/");
    const html = await res.text();
    expect(html).toContain("英単語クイズ");
    expect(html).toContain("id=\"word\"");
    expect(html).toContain("id=\"meaning\"");
    expect(html).toContain("id=\"show-answer\"");
    expect(html).toContain("id=\"next-word\"");
  });
});
