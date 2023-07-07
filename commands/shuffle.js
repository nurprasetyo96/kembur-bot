const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

const command = {
	data: new SlashCommandBuilder()
		.setName('shuffle')
		.setDescription('Senenganmu random?'),
	async execute(interaction) {
		const channel = interaction.member.voice.channel;
		if (!channel) return interaction.reply('You are not connected to a voice channel!');

		await interaction.deferReply();

		try {
			const queue = useQueue(interaction.guild.id);
			queue.tracks.shuffle();

			return interaction.followUp('Shuffle!');
		}
		catch (e) {
			return interaction.followUp(`Something went wrong: ${e}`);
		}
	},
};

module.exports = {
	...command,
};