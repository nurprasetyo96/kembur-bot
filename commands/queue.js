const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

const command = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('Lu punya judul lu punya kuasa!'),
	async execute(interaction) {
		const channel = interaction.member.voice.channel;
		if (!channel) return interaction.reply('You are not connected to a voice channel!');

		await interaction.deferReply();

		try {
			const queue = useQueue(interaction.guild.id);
			const tracks = queue.tracks.toArray();
			const currentTrack = queue.currentTrack;
			if (tracks.length === 0) {
				return interaction.followUp({
					content: `
Current playing: ${currentTrack}
                    
Queue empty.
`,
					ephemeral: true,
				});
			}
			let list = '';
			for (const key in tracks) {
				if (Object.hasOwnProperty.call(tracks, key)) {
					const element = tracks[key];
					list += `
${key} : ${element.title}
                    `;
				}
			}
			return interaction.followUp({
				content: `
Current playing: ${currentTrack}
                
Queue:
${list}
`,
				ephemeral: true,
			});
		}
		catch (e) {
			return interaction.followUp(`Something went wrong: ${e}`);
		}
	},
};

module.exports = {
	...command,
};