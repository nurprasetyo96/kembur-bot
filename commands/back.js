const { SlashCommandBuilder } = require('discord.js');
const { useHistory } = require('discord-player');

const command = {
	data: new SlashCommandBuilder()
		.setName('back')
		.setDescription('Piye? iseh enak jamanku to'),
	async execute(interaction) {
		const channel = interaction.member.voice.channel;
		if (!channel) return interaction.reply('You are not connected to a voice channel!');

		await interaction.deferReply();

		try {
			const history = useHistory(interaction.guild.id);
			history.previous();

			return interaction.followUp('Going back!');
		}
		catch (e) {
			return interaction.followUp(`Something went wrong: ${e}`);
		}
	},
};

module.exports = {
	...command,
};