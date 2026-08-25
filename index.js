require('dotenv').config();
const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
} = require('discord.js');
const { generateComplaint } = require('./complaintGenerator');

const GENERATE_BUTTON_ID = 'greggs_generate_complaint';
const GREGGS_BLUE = 0x00539b;

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  try {
    if (interaction.isChatInputCommand() && interaction.commandName === 'sendpanel') {
      await handleSendPanel(interaction);
    } else if (interaction.isButton() && interaction.customId === GENERATE_BUTTON_ID) {
      await handleGenerateButton(interaction);
    }
  } catch (err) {
    console.error('Error handling interaction:', err);
    const reply = { content: 'Something went wrong. Please try again.', ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(reply).catch(() => {});
    } else {
      await interaction.reply(reply).catch(() => {});
    }
  }
});

async function handleSendPanel(interaction) {
  // Restrict to members who can manage the server, mirroring the command's default permission.
  if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)) {
    return interaction.reply({
      content: "You don't have permission to use this command.",
      ephemeral: true,
    });
  }

  const title = interaction.options.getString('title', true);
  const description = interaction.options.getString('description', true);
  const image = interaction.options.getAttachment('image');

  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(GREGGS_BLUE)
    .setFooter({ text: 'Click Generate for a fresh complaint' });

  if (image) {
    embed.setImage(image.url);
  }

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(GENERATE_BUTTON_ID)
      .setLabel('Generate')
      .setEmoji('🥐')
      .setStyle(ButtonStyle.Primary)
  );

  await interaction.channel.send({ embeds: [embed], components: [row] });
  await interaction.reply({ content: 'Panel sent!', ephemeral: true });
}

async function handleGenerateButton(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const complaintText = await generateComplaint();

  const embed = new EmbedBuilder()
    .setTitle('📝 Official Greggs Complaint')
    .setDescription(complaintText)
    .setColor(GREGGS_BLUE)
    .setFooter({ text: `Generated for ${interaction.user.username} • not a real complaint` })
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(GENERATE_BUTTON_ID)
      .setLabel('Generate Another')
      .setEmoji('🔁')
      .setStyle(ButtonStyle.Secondary)
  );

  await interaction.editReply({ embeds: [embed], components: [row] });
}

client.login(process.env.DISCORD_TOKEN);
