require('dotenv').config();
const { REST, Routes, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const commands = [
  new SlashCommandBuilder()
    .setName('sendpanel')
    .setDescription('Post the Greggs complaint generator panel in this channel')
    .addStringOption((opt) =>
      opt.setName('title').setDescription('Panel title').setRequired(true)
    )
    .addStringOption((opt) =>
      opt.setName('description').setDescription('Panel description').setRequired(true)
    )
    .addAttachmentOption((opt) =>
      opt.setName('image').setDescription('Image to show on the panel').setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .toJSON(),
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    if (!process.env.DISCORD_TOKEN || !process.env.CLIENT_ID) {
      throw new Error('DISCORD_TOKEN and CLIENT_ID must be set in your environment (.env or Railway variables).');
    }

    console.log(`Registering ${commands.length} slash command(s)...`);

    if (process.env.GUILD_ID) {
      // Guild commands update instantly - best for development/testing
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        { body: commands }
      );
      console.log(`Registered commands to guild ${process.env.GUILD_ID}.`);
    } else {
      // Global commands can take up to an hour to propagate
      await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
      console.log('Registered global commands.');
    }
  } catch (error) {
    console.error('Failed to register commands:', error);
    process.exit(1);
  }
})();
