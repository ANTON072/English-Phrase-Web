# english-phrase-web

A mobile-friendly English vocabulary quiz web app powered by Notion. Built with [Hono](https://hono.dev/) and deployed on [Vercel](https://vercel.com/).

## How It Works

1. Fetches vocabulary data from a Notion database
2. Displays a random English word with an example sentence
3. Tap "Show Answer" to reveal the Japanese meaning
4. Tap "Next Word" to move on

## Setup

```bash
pnpm install
cp .env.example .env
```

Set the following environment variables in `.env`:

| Variable             | Description                   |
| -------------------- | ----------------------------- |
| `NOTION_API_KEY`     | Notion integration token      |
| `NOTION_DATABASE_ID` | ID of the vocabulary database |

### Notion Database Schema

The Notion database must have these properties:

| Property | Type         | Description                  |
| -------- | ------------ | ---------------------------- |
| 単語     | Title        | English word or phrase       |
| 意味     | Text         | Japanese meaning             |
| 品詞     | Multi-select | Part of speech               |
| 例文     | Text         | Example sentence             |
| 例文訳   | Text         | Example sentence translation |

## Development

```bash
pnpm dev    # Start local server at http://localhost:3000
pnpm test   # Run tests
```

## Deploy to Vercel

```bash
npx vercel login
npx vercel env add NOTION_API_KEY
npx vercel env add NOTION_DATABASE_ID
npx vercel
```

## Tech Stack

- [Hono](https://hono.dev/) — Lightweight web framework with JSX support
- [Vercel](https://vercel.com/) — Serverless deployment
- [@notionhq/client](https://github.com/makenotion/notion-sdk-js) — Notion API client
- [Vitest](https://vitest.dev/) — Testing
