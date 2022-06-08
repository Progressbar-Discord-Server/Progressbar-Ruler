const { SlashCommandBuilder } = require('@discordjs/builders')
const { GuildMember } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('list')
    .setDescription("List bans and kicks and warns and stuff")
    .addSubcommand(sc => sc
      .setName('warns')
      .setDescription('List warns')
      .addStringOption(o => o
        .setName("user")
        .setDescription("The user to list warnings (Id)")))
    .addSubcommand(sc => sc
      .setName("bans")
      .setDescription('List bans')
      .addStringOption(o => o
        .setName("user")
        .setDescription("The user to list bans (Id)")))
    .addSubcommand(sc => sc
      .setName("kicks")
      .setDescription("List kicks")
      .addStringOption(o => o
        .setName("user")
        .setDescription("The user to list kicks (Id)"))),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand()
    if (subcommand === "warns") {
      await interaction.deferReply({ ephemeral: true })
      let IdUser = interaction.options.getString("user")
      
      if (!IdUser) {
        IdUser = interaction.member
        if (!(user instanceof GuildMember)) {
          await interaction.guild.members.fetch(IdUser)
        }
      }

      db = interaction.client.db.Cases
      warnDB = await db.findAll({
        where: {
          userID: user.id,
          type: "warn"
        },
        attributes: ['id', 'type', 'userID', 'reason', 'Executor']
      })
      let list = ""
      for (let i = 0; i < warnDB.length; i++) {
        list += `${warnDB[i].reason} - *insert date here*\n`
      }
      console.log(list)
      if (list !== "") {
        interaction.followUp({ content: list })
      }
      else if (list === "") {
        interaction.followUp({ content: "There is no warn" })
      }
    }
    else if (subcommand === "bans") {
      await interaction.deferReply({ ephemeral: true })
      let user = interaction.options.getMember("user")
      if (!user) {
        user = interaction.member
      }
      if (!(user instanceof GuildMember)) {
        await interaction.guild.member.fetch(user)
      }

      db = interaction.client.db.Cases
      banDB = await db.findAll({
        where: {
          userID: user.id,
          type: "bans"
        },
        attributes: ['id', 'type', 'userID', 'reason', 'Executor']
      })
      let list = ""

      for (let i = 0; i < warnDB.length; i++) {
        list += `${warnDB[i].reason} - *insert date here*\n`
      }
      console.log(list)
      if (list !== "") {
        interaction.followUp({ content: list })
      }
      else if (list === "") {
        interaction.followUp({ content: "There is no warn" })
      }
    }
    else if (subcommand === "kicks") {
      await interaction.deferReply({ ephemeral: true })
      let user = interaction.options.getString("user")

      if (!IdUser) {
        IdUser = interaction.member
        if (!(IdUser instanceof GuildMember)) {
          await interaction.guild.member.fetch(IdUser)
        }
      }

      db = interaction.client.db.Cases
      banDB = await db.findAll({
        where: {
          userID: user.id,
          type: "kick"
        },
        attributes: ['id', 'type', 'userID', 'reason', 'Executor']
      })
      let list = ""

      for (let i = 0; i < warnDB.length; i++) {
        list += `${warnDB[i].reason} - *insert date here*\n`
      }
      console.log(list)
      if (list !== "") {
        interaction.followUp({ content: list })
      }
      else if (list === "") {
        interaction.followUp({ content: "There is no warn" })
      }
    }
  }
}
