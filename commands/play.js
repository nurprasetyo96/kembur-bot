const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer, useQueue } = require('discord-player');
const player = useMainPlayer();

const command = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Koe nduwe judul koe isoh muter')
		.addStringOption((option) =>
			option.setName('query').setDescription('the search keywords or url').setRequired(true),
		),
	async execute(interaction) {
		const channel = interaction.member.voice.channel;
		if (!channel) return interaction.reply('You are not connected to a voice channel!');

		let queue = useQueue(interaction.guild.id);

		if (!queue) {
			queue = player.nodes.create(interaction.guild.id);
		}
		else if (queue.channel !== channel) {
			return interaction.reply({
				content: 'I am already playing in another channel!',
				ephemeral: true,
			});
		}

		if (!queue.channel) {
			queue.connect(channel);
		}

		// const queue = player.nodes.create(interaction.guild.id);
		const query = interaction.options.getString('query', true);

		await interaction.deferReply();

		try {
			// const { track } = await interaction.client.player.play(channel, query, {
			// 	nodeOptions: {
			// 		metadata: interaction,
			// 	},
			// });

			const result = await player.search(query);

			const entry = queue.tasksQueue.acquire();

			await entry.getTask();

			queue.addTrack(result.tracks[0]);
			queue.setMetadata(
				{
					channel: interaction.channel,
					timestamp: interaction.createdTimestamp,
				},
			);

			try {
				// if player node was not previously playing, play a song
				if (!queue.isPlaying()) {
					queue.node.play();
					return interaction.followUp(`**${result.tracks[0].title}** queued!`);
				}
				return interaction.followUp(`**${result.tracks[0].title}** queued!`);
			}
			finally {
				queue.tasksQueue.release();
			}
		}
		catch (e) {
			return interaction.followUp(`Something went wrong: ${e}`);
		}
	},
};

module.exports = {
	...command,
};