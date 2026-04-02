import { Hono } from "hono";
import { html } from "hono/html";
import { getPhrases } from "./notion-client.js";
import { pickRandom } from "./notion.js";

export const app = new Hono();

app.get("/api/phrase", async (c) => {
  const phrases = await getPhrases();
  if (phrases.length === 0) {
    return c.json({ error: "No phrases found" }, 500);
  }
  return c.json(pickRandom(phrases));
});

app.get("/", (c) => {
  return c.html(
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>英単語クイズ</title>
        {html`
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
              background: #f5f5f5;
              min-height: 100dvh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 16px;
            }
            .card {
              background: #fff;
              border-radius: 16px;
              box-shadow: 0 2px 12px rgba(0,0,0,0.1);
              padding: 32px 24px;
              width: 100%;
              max-width: 400px;
              text-align: center;
            }
            .counter {
              font-size: 14px;
              color: #888;
              margin-bottom: 16px;
            }
            #word {
              font-size: 28px;
              font-weight: bold;
              margin-bottom: 8px;
            }
            .pos {
              font-size: 14px;
              color: #666;
              margin-bottom: 12px;
            }
            .example {
              font-size: 16px;
              color: #444;
              margin-bottom: 24px;
              line-height: 1.5;
            }
            #answer-section {
              display: none;
            }
            #meaning {
              font-size: 24px;
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 8px;
            }
            .example-translation {
              font-size: 15px;
              color: #555;
              margin-bottom: 24px;
              line-height: 1.5;
            }
            button {
              width: 100%;
              padding: 16px;
              font-size: 18px;
              border: none;
              border-radius: 12px;
              cursor: pointer;
              font-weight: bold;
              transition: background 0.2s;
            }
            #show-answer {
              background: #2563eb;
              color: #fff;
            }
            #show-answer:active { background: #1d4ed8; }
            #next-word {
              background: #10b981;
              color: #fff;
              display: none;
            }
            #next-word:active { background: #059669; }
            .loading {
              color: #888;
              font-size: 16px;
            }
          </style>
        `}
      </head>
      <body>
        <div class="card">
          <div class="counter" id="counter"></div>
          <div id="word" class="loading">読み込み中...</div>
          <div class="pos" id="pos"></div>
          <div class="example" id="example"></div>
          <button id="show-answer">答えを見る</button>
          <div id="answer-section">
            <div id="meaning"></div>
            <div class="example-translation" id="example-translation"></div>
            <button id="next-word">次の問題</button>
          </div>
        </div>
        {html`
          <script>
            let count = 0;

            async function loadPhrase() {
              const res = await fetch('/api/phrase');
              const phrase = await res.json();
              count++;

              document.getElementById('counter').textContent = '#' + count;
              document.getElementById('word').textContent = phrase.word;
              document.getElementById('pos').textContent = phrase.partOfSpeech.length > 0 ? phrase.partOfSpeech.join(', ') : '';
              document.getElementById('example').textContent = phrase.example || '';
              document.getElementById('meaning').textContent = phrase.meaning;
              document.getElementById('example-translation').textContent = phrase.exampleTranslation || '';

              document.getElementById('answer-section').style.display = 'none';
              document.getElementById('show-answer').style.display = 'block';
            }

            document.getElementById('show-answer').addEventListener('click', () => {
              document.getElementById('show-answer').style.display = 'none';
              document.getElementById('answer-section').style.display = 'block';
              document.getElementById('next-word').style.display = 'block';
            });

            document.getElementById('next-word').addEventListener('click', () => {
              loadPhrase();
            });

            loadPhrase();
          </script>
        `}
      </body>
    </html>
  );
});
