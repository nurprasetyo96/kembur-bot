const { SlashCommandBuilder } = require('discord.js');

const command = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};

module.exports = {
	...command,
};