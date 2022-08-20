const { User, GuildMember, EmbedBuilder } = require('discord.js')
const { logCha } = require('../config.json')

async function ban(interaction, member, reason = "No reason provided", joke = false, db) {
  const guild = interaction.guild

  if (!(member instanceof GuildMember)) {
    await guild.members.fetch(member)
  }

  const dmEmbed = new EmbedBuilder()
    .setColor("#f04a47")
    .setDescription(`You have been banned from ${guild.name}` + (reason === "No reason provided" ? "" : ` for ${reason}`));
  const replyEmbed = new EmbedBuilder()
    .setColor("#43b582")
    .setDescription(`**${member.user.tag} has been banned for:** ${reason}`);
  const logEmbed = new EmbedBuilder()
    .setDescription("Ban")
    .setColor("#f04a47")
    .addFields(
      { name: "**User**", value: member.user.tag, inline: true },
      { name: "**Moderator**", value: interaction.user.tag, inline: true },
      { name: "**Reason**", value: reason, inline: true }
    );

  if (member.bannable) {
    if (member.user.id === interaction.user.id) return interaction.followUp("Why do you want to ban yourself?")
    if (member.user.id === interaction.client.user.id) return interaction.followUp("❌ Why would you ban me? 😢")
    
    await member.user.send({ embeds: [dmEmbed] }).catch(e => console.error(`Couldn't message ${member.user.tag} (ban)`))

    if (!joke) {
      try {
        guild.members.ban(member.user, { reason: reason });
      } catch (err) {
        console.error(err)
        return interaction.followUp("Couldn't ban that user")
      }

      db.create({
        Executor: interaction.user.id,
        userID: member.user.id,
        reason: reason,
        type: "ban",
      });

      let logChannel = await interaction.guild.channels.fetch(logCha)
      await logChannel.send({ embeds: [logEmbed] }).catch(console.error)
    }
    interaction.followUp({ embeds: [replyEmbed] }).catch(console.error)
  } else if (!member.bannable) interaction.followUp("Erf, I can't do that");
}

async function kick(interaction, member, reason = "No reason provided", joke = false, db) {
  const guild = interaction.guild

  if (!(member instanceof GuildMember)) {
    guild.members.fetch(member)
  }

  const dmEmbed = new EmbedBuilder()
    .setColor("#f04a47")
    .setDescription(`You have been kicked from ${guild.name}` + (reason === "No reason provided" ? "" : ` for ${reason}`));
  const replyEmbed = new EmbedBuilder()
    .setColor("#43b582")
    .setDescription(`**${member.user.tag} has been kicked` + (reason === "No reason provided"? "**" : `for:** ${reason}`));
  const logEmbed = new EmbedBuilder()
    .setDescription("Kick")
    .setColor("#f04a47")
    .addFields(
      { name: "**User**", value: member.user.tag, inline: true },
      { name: "**Moderator**", value: interaction.user.tag, inline: true },
      { name: "**Reason**", value: reason, inline: true }
    );

  if (member.kickable) {
    if (member.user.id === interaction.user.id) return interaction.followUp("Why do you want to kick yourself?")
    if (member.user.id === interaction.client.user.id) return interaction.followUp("❌ Why would you kick me? 😢")
    
    await member.user.send({ embeds: [dmEmbed] }).catch(e => {console.error(`Couldn't message ${member.user.tag} (kick)`)})
    
    if (!joke) {
      try {
        guild.members.kick(member.user, { reason: reason });
      } catch (err) {
        console.error(err)
        return interaction.followUp("Couldn't kick that user.")
      }

      db.create({
        Executor: interaction.user.id,
        userID: member.user.id,
        reason: reason,
        type: "kick",
      });

      let logChannel = await interaction.guild.channels.fetch(logCha)
      await logChannel.send({embeds: [logEmbed]})
    }
    interaction.followUp({ embeds: [replyEmbed] })
  } else if (!member.bannable) interaction.followUp("Erf, I can't do that");
}

async function warn(interaction, user, reason, joke = false, db) {
  if (!(user instanceof User)) {
    interaction.client.users.fetch(user)
  }

  const dmEmbed = new EmbedBuilder()
    .setColor("#f04a47")
    .setDescription(`You have been warned from ${interaction.guild.name}` + reason === "No reason provided" ? "" : ` for ${reason}`);
  const replyEmbed = new EmbedBuilder()
    .setColor("#43b582")
    .setDescription(`**${user.tag} has been warned for:** ${reason}`);
  const logEmbed = new EmbedBuilder()
    .setDescription("Warn")
    .setColor("#f04a47")
    .addFields(
      { name: "**User**", value: user.tag, inline: true },
      { name: "**Moderator**", value: interaction.user.tag, inline: true },
      { name: "**Reason**", value: reason, inline: true }
    );

  if (user.id === interaction.client.user.id) return interaction.followUp("I just deleted my own warn <:troll:990669002999201852>")

  if (!joke) {
    db.create({
      type: "warn",
      reason: reason,
      Executor: interaction.user.tag,
      userID: user.id
    });

    let logChannel = await interaction.guild.channels.fetch(logCha)
    await logChannel.send({ embeds: [logEmbed] })
  };

  await user.send({ embeds: [dmEmbed] }).catch(e => {console.error(`Couldn't message ${user.tag} (warn)`)})
  await interaction.followUp({ embeds: [replyEmbed] })
}

module.exports = { ban, kick, warn }