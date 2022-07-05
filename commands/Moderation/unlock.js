const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription("unlock a channel")
    .addChannelOption(o => o
      .setName("channel")
      .setDescription("the channel to lock")
      .setRequired(true))
    .addStringOption(o => o
      .setName("reason")
      .setDescription("Why should this channel be unlocked?")),
  async execute(interaction) {
    const replyEmbed = new MessageEmbed()
    let channel = interaction.options.getChannel("channel");
    let reason = interaction.options.getString("reason");

    if (!reason) reason = "No reason provided";

    if (channel.type === "GUILD_NEWS") {
      return interaction.reply("No");
    } else if (channel.type === "GUILD_TEXT") {
      channel.permissionOverwrites.edit(interaction.guildId, {
        SEND_MESSAGES: true,
        SEND_MESSAGES_IN_THREADS: true,
        CREATE_PUBLIC_THREADS: true,
        CREATE_PRIVATE_THREADS: true,
      }, { reason: reason, type: 0 })
      .setDescription("Channel unlocked")
      .setColor("#00FF00");
    interaction.reply({embeds: [replyEmbed]});
    }
  }
}