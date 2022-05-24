const { SlashCommandBuilder } = require('@discordjs/builders')
const { guildId } = require('../config.json')

module.exports = {
    data: new SlashCommandBuilder()
      .setName('list')
      .setDescription("List bans and kicks and warns and stuff")
      .addSubcommand(subcommand => subcommand
            .setName('warns')
            .setDescription('list warns')
            .addUserOption(o => o
              .setName("user")
              .setDescription("The user to list warnings")
              .setRequired(true))
            ),
    async execute(interaction) {
		const subcommand = interaction.options.getSubcommand()
		if (subcommand == "warns") { 
      const user = interaction.options.getMember("user").user
			interaction.deferReply()
      db = interaction.client.db.Warns
      list = await db.findAll({where: { userID: user.id }})
      interaction.reply(list)
		}
	}
}
