const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

const command = {
	data: new SlashCommandBuilder()
		.setName('repeat')
		.setDescription('Sajake lagi seneng lagu iki?')
		.addStringOption((option) =>
			option.setName('mode').setDescription('mode (0, 1, 2, 4)').setRequired(true),
		),
	async execute(interaction) {
		const channel = interaction.member.voice.channel;
		if (!channel) return interaction.reply('You are not connected to a voice channel!');

		const mode = interaction.options.getString('mode', true);

		const modeList = ['Off', 'Track', 'Queue', 'Autoplay'];

		await interaction.deferReply();

		try {
			const queue = useQueue(interaction.guild.id);
			queue.setRepeatMode(mode);

			return interaction.followUp(`Repeat Mode! ***${modeList[mode]}***`);
		}
		catch (e) {
			return interaction.followUp(`Something went wrong: ${e}`);
		}
	},
};

module.exports = {
	...command,
};