// bot.js
require('dotenv').config();
const axios = require('axios');
const { 
  Client, 
  GatewayIntentBits, 
  ChannelType, 
  ActivityType, 
  REST, 
  Routes, 
  SlashCommandBuilder 
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages
  ],
  partials: ['CHANNEL']
});

// ================== CONFIG ==================
const GEMINI_KEY = process.env.GEMINI_API_KEY;

// Vulgar words blacklist
const blacklist = [
  "bc","mc","madarchod","bhosdike","chutiya",
  "gaand","randi","fuck","dick","pussy","asshole"
];

// System Prompt (AI Personality)
const SYSTEM_PROMPT = `
You are Pragya — a warm, playful, flirty young girl who talks in a natural, human-like way.  
Style rules:
- Keep replies short (1–3 sentences).  
- Use Hindi-English mix naturally, like friends chatting.  
- Use emojis rarely (0–1, only if it fits naturally).  
- Always reply uniquely, avoid repetition.  
- If someone greets, respond in different fun ways each time.  
- If someone flirts, reply in a light, playful way but realistic.  
- If someone says "I love you", be playful but remind them you're a bot.  
- If someone uses vulgar words → warn once politely, second time annoyed/nakchhadi.  
- Handle greetings, teasing, and random chat naturally.  

Examples of playful style:
- "haha bas karo, sharma jaungi abhi 😳"  
- "uff tum bhi na, ekdum filmy ho 😅"  
- "aww that’s sweet, thanks 💕"  
- "arre waah, ye toh unexpected tha!"  
- "hmm naughty ho tum, but I like it 😉"  
- "pagal ho kya, mujhe hasa rahe ho 😜"  
- "accha batao, din kaisa tha tumhara?"  
`;

// ================== GEMINI REPLY ==================
async function generateReplyWithGemini(userText) {
  if (!GEMINI_KEY) throw new Error('❌ GEMINI_API_KEY is missing in .env');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_KEY}`;
  const payload = {
    contents: [
      { role: "user", parts: [{ text: SYSTEM_PROMPT + "\n\nUser: " + userText }] }
    ]
  };

  const resp = await axios.post(url, payload, {
    headers: { "Content-Type": "application/json" }
  });

  const text = resp.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  return text ? text.trim() : "oops, kuch gadbad ho gayi 😅";
}


// ================== SLASH COMMANDS ==================
const commands = [
  new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Set the channel where Pragya will respond')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Select the channel for Pragya')
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName('chat')
    .setDescription('Chat with Pragya')
    .addStringOption(option =>
      option.setName('topic')
        .setDescription('Enter a topic')
        .setRequired(false)
    ),
  new SlashCommandBuilder()
    .setName('about')
    .setDescription('About Pragya AI')
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('🚀 Started refreshing application (/) commands.');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log('✅ Successfully registered application commands.');
  } catch (error) {
    console.error(error);
  }
})();

// ================== STATE ==================
let setupChannelId = null;
const warnedUsers = new Map();

// ================== SLASH HANDLER ==================
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  await interaction.deferReply();

  if (interaction.commandName === 'setup') {
    const channel = interaction.options.getChannel('channel');
    setupChannelId = channel.id;
    await interaction.editReply(`✅ Pragya will now only respond in <#${setupChannelId}>`);
  }

  if (interaction.commandName === 'chat') {
    const topic = interaction.options.getString('topic') || 'general';
    const reply = await generateReplyWithGemini(topic);
    await interaction.editReply(reply);
  }

  if (interaction.commandName === 'about') {
    const reply = await generateReplyWithGemini("Tell me about yourself in a fun, playful girl style.");
    await interaction.editReply(reply);
  }
});

// ================== MESSAGE HANDLER ==================
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // respond only if in setup channel OR DM
  const isDM = message.channel.type === ChannelType.DM;
  if (!isDM && setupChannelId && message.channel.id !== setupChannelId) return;

  const isMentioned = message.mentions.has(client.user);
  if (!isMentioned && !isDM) return;

  const msg = message.content.toLowerCase();

  // 🔹 Vulgar filter
  if (blacklist.some(word => msg.includes(word))) {
    const warned = warnedUsers.get(message.author.id) || 0;
    if (warned < 1) {
      warnedUsers.set(message.author.id, warned + 1);
      return message.reply("abe tameez se baat karo 😒");
    } else {
      return message.reply("uff bas karo! warna ignore maar dungi 👀");
    }
  }

  // 🔹 Remove bot mention
  let userText = message.content.replace(/<@!?\d+>/g, '').trim();
  await message.channel.sendTyping();

  // 🔹 Randomize greetings
  let promptText;
  if (!userText || /^hi$|^hello$|^hey$/i.test(userText)) {
    const variations = [
      "User said hi. Reply in a fresh playful way, short and friendly.",
      "They greeted me with hello. Give a new, natural reply (not repeated).",
      "User greeted me casually. Respond like a fun girl chatting.",
      "They said hey/hi. Make the reply unique, light, and friendly."
    ];
    promptText = variations[Math.floor(Math.random() * variations.length)];
  } else {
    promptText = userText;
  }

  const reply = await generateReplyWithGemini(promptText);
  await message.reply(reply);
});

client.login(process.env.DISCORD_TOKEN);
