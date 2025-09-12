# Pragya - Discord Chatbot 🤖💫

A friendly Discord bot named Pragya that loves to chat and make friends!

## Features ✨

- **Friendly Conversations**: Pragya responds to mentions and DMs with personalized, context-aware messages
- **Smart Responses**: Different response types based on message content (greetings, questions, compliments, etc.)
- **Beautiful Embeds**: All responses are formatted in pretty Discord embeds
- **Slash Commands**: Interactive commands for better user experience
- **Natural Typing**: Shows typing indicator and adds realistic delays
- **Safe & Wholesome**: Designed for appropriate, friendly interactions

## Setup Instructions 🚀

### 1. Create a Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and name it "Pragya"
3. Go to "Bot" section and click "Add Bot"
4. Copy the bot token (you'll need this later)
5. Enable these Privileged Gateway Intents:
   - SERVER MEMBERS INTENT
   - MESSAGE CONTENT INTENT

### 2. Invite Bot to Server

1. Go to "OAuth2" > "URL Generator"
2. Select scopes: `bot` and `applications.commands`
3. Select bot permissions:
   - Send Messages
   - Use Slash Commands
   - Read Message History
   - Add Reactions
   - Embed Links
4. Copy the generated URL and invite the bot to your server

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env`
2. Fill in your bot token and client ID:
   ```
   DISCORD_TOKEN=your_bot_token_here
   CLIENT_ID=your_client_id_here
   ```

### 4. Install and Run

```bash
# Install dependencies
npm install

# Deploy slash commands (run this once)
npm run deploy-commands

# Start the bot
npm start

# For development (auto-restart)
npm run dev
```

## Usage 💬

### Chat with Pragya

- **Mention in server**: `@Pragya Hello! How are you?`
- **Direct Message**: Just send a message directly to Pragya
- **Slash Commands**: 
  - `/chat` - Start a conversation
  - `/about` - Learn more about Pragya

### Response Types

Pragya recognizes different types of messages and responds appropriately:

- **Greetings**: "hi", "hello", "hey" → Friendly welcome
- **Questions**: Messages with "?", "what", "why" → Thoughtful responses
- **Compliments**: "nice", "cool", "awesome" → Appreciative replies
- **Jokes**: "haha", "lol", "funny" → Playful responses
- **Goodbyes**: "bye", "see you" → Farewell messages
- **General**: Everything else → Encouraging conversation

## Customization 🎨

You can easily customize Pragya by modifying:

- **Responses**: Edit the `responses` object in `bot.js`
- **Keywords**: Modify the `keywords` object to change trigger words
- **Colors**: Change embed colors (currently pink `#FF69B4`)
- **Personality**: Adjust response tone and style

## Safety Features 🛡️

- Ignores messages from other bots
- Only responds when mentioned or in DMs
- All responses are wholesome and appropriate
- Clear identification as an AI bot
- No data collection or storage

## Support 💖

If you need help setting up Pragya or have questions, feel free to reach out!

---

**Note**: This bot is designed to be a friendly, appropriate chatbot for all users. It clearly identifies itself as an AI and maintains wholesome interactions.