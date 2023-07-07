const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

const command = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Heleh senengane gonta ganti'),
	async execute(interaction) {
		const channel = interaction.member.voice.channel;
		if (!channel) return interaction.reply('You are not connected to a voice channel!');

		await interaction.deferReply();

		try {
			const queue = useQueue(interaction.guild.id);
			queue.node.skip();

			return interaction.followUp('Skipped!');
		}
		catch (e) {
			return interaction.followUp(`Something went wrong: ${e}`);
		}
	},
};

module.exports = {
	...command,
};