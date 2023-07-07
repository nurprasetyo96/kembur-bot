const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

const command = {
	data: new SlashCommandBuilder()
		.setName('remove')
		.setDescription('Rasido diputer bos?')
		.addStringOption((option) =>
			option.setName('index').setDescription('track number').setRequired(true),
		),
	async execute(interaction) {
		const channel = interaction.member.voice.channel;
		if (!channel) return interaction.reply('You are not connected to a voice channel!');

		const index = interaction.options.getString('index', true);

		await interaction.deferReply();

		try {
			const queue = useQueue(interaction.guild.id);
			const tracks = queue.tracks.toArray();
			queue.removeTrack(tracks[index]);

			return interaction.followUp('Removed!');
		}
		catch (e) {
			return interaction.followUp(`Something went wrong: ${e}`);
		}
	},
};

module.exports = {
	...command,
};