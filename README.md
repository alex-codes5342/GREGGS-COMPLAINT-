# Greggs Complaint Bot

A Discord bot that posts a panel with a **Generate** button. Clicking it produces a
silly, fictional 4-line "complaint" about a bad Greggs experience — for entertainment
only, not a real complaint tool.

## Features

- `/sendpanel <title> <description> [image]` — posts an embed panel with a Generate button
  in the current channel. Requires "Manage Server" permission.
- Clicking **Generate** replies (privately, to the clicker) with a random 4-line
  complaint and a "Generate Another" button.
- Uses OpenAI to write the complaint if `OPENAI_API_KEY` is set; otherwise falls back
  to a built-in local random generator, so it works with zero external AI cost.

## 1. Create the Discord application

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications) → **New Application**.
2. Under **Bot**, click **Reset Token** and copy it — this is `DISCORD_TOKEN`.
3. Under **Bot**, make sure "Public Bot" is off if you don't want others adding it, and
   no privileged intents are needed for this bot.
4. Under **OAuth2 → General**, copy the **Application (Client) ID** — this is `CLIENT_ID`.
5. Under **OAuth2 → URL Generator**, select scopes `bot` and `applications.commands`,
   and permissions `Send Messages`, `Embed Links`, `Use Slash Commands`. Open the
   generated URL to invite the bot to your server.

## 2. Configure environment variables

Copy `.env.example` to `.env` locally (for testing) and fill in:

```
DISCORD_TOKEN=your-bot-token
CLIENT_ID=your-application-id
GUILD_ID=your-test-server-id   # optional but recommended for instant command updates
OPENAI_API_KEY=                 # optional — leave blank to use the local generator
OPENAI_MODEL=gpt-4o-mini
```

## 3. Install dependencies and register commands

```bash
npm install
npm run deploy     # registers /sendpanel
```

If `GUILD_ID` is set, the command appears instantly in that server. If left blank,
it registers globally, which can take up to an hour to show up everywhere.

## 4. Run locally (optional)

```bash
npm start
```

## 5. Deploy to Railway

1. Push this folder to a GitHub repo (or use `railway init` with the Railway CLI).
2. In [Railway](https://railway.app), create a **New Project → Deploy from GitHub repo**,
   selecting this repo.
3. In the Railway project's **Variables** tab, add the same variables as your `.env`
   file: `DISCORD_TOKEN`, `CLIENT_ID`, `GUILD_ID` (optional), `OPENAI_API_KEY` (optional),
   `OPENAI_MODEL` (optional).
4. Railway will detect `package.json`, install dependencies, and run `node index.js`
   (via `railway.json` / `Procfile`).
5. Slash commands aren't auto-registered on every boot (Discord rate-limits this).
   Register them once by running `npm run deploy` locally, or by adding a one-off
   Railway "Deploy Command" / shell run of `node deploy-commands.js` after setting
   variables there.

## 6. Use it

In your Discord server, run:

```
/sendpanel title:"Greggs Complaint Generator" description:"Click below for your daily dose of pastry outrage." image:<optional file>
```

This posts the panel. Anyone can click **Generate** to get a private, random complaint.

## Customizing the complaints

Edit `complaintGenerator.js`:
- `OPENERS`, `FOOD_ISSUES`, `STAFF_ISSUES`, `CLOSERS` arrays control the local (offline)
  generator — add your own lines for more variety.
- The AI prompt in `generateAIComplaint()` controls tone/style when `OPENAI_API_KEY` is set.

## Notes

- All generated complaints are clearly fictional/comedic and are never sent anywhere
  outside Discord — this bot does not file real complaints with Greggs.
- The Generate button reply is ephemeral (only visible to the clicker) to avoid
  flooding the channel; change `ephemeral: true` to `false` in `index.js` if you'd
  rather have complaints posted publicly.
