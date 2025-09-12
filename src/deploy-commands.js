const { REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const commands = [
    new SlashCommandBuilder()
        .setName('chat')
        .setDescription('Start a conversation with Pragya!')
        .addStringOption(option =>
            option.setName('topic')
                .setDescription('What would you like to talk about?')
                .setRequired(false)
        ),

    new SlashCommandBuilder()
        .setName('about')
        .setDescription('Learn more about Pragya!'),

    new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Set the channel where Pragya will respond')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Select the channel for Pragya')
                .setRequired(true)
        )
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('🚀 Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );

        console.log('✅ Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
