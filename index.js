const { Client, GatewayIntentBits, Collection, Events } = require('discord.js');
const dotenv = require('dotenv');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const { Player } = require('discord-player');
const path = require('path');
const { YouTubeExtractor } = require('@discord-player/extractor');

dotenv.config();
const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;

const client = new Client({ intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.GuildVoiceStates,
] });

const player = new Player(client, {
	ytdlOptions: {
		quality: 'highestaudio',
		highWaterMark: 1 << 25,
	},
});

const commands = [];
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if ('data' in command && 'execute' in command) {
		commands.push(command.data.toJSON());
		client.commands.set(command.data.name, command);
	}
	else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}


const rest = new REST().setToken(token);

(async () => {
	try {
		await player.extractors.register(YouTubeExtractor, {});
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	}
	catch (error) {
		console.error(error);
	}
})();

// Events listeners
player.events.on('error', (queue, error) => {
	console.log(
		`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
});

player.events.on('playerError', (queue, error) => {
	console.log(
		`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
});

player.events.on('playerStart', (queue, track) => {
	queue.metadata.channel.send(
		`▶ | Started playing: **${track.title}**!`);
});

player.events.on('disconnect', queue => {
	queue.metadata.channel.send(
		'❌ | I was manually disconnected from the voice channel, clearing queue!');
});

player.events.on('emptyChannel', queue => {
	queue.metadata.channel.send('❌ | Nobody is in the voice channel, leaving...');
});

player.events.on('audioTracksAdd', (queue, track) => {
	// Emitted when the player adds multiple songs to its queue
	queue.metadata.send('Multiple Track\'s queued');
});

player.events.on('playerSkip', (queue, track) => {
	// Emitted when the audio player fails to load the stream for a song
	queue.metadata.send(`Skipping **${track.title}** due to an issue!`);
});

player.events.on('emptyQueue', queue => {
	queue.metadata.channel.send('✅ | Queue finished!');
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		}
		else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on('ready', function() {
	client.user.setActivity('Mobile Legends', { type: 'PLAYING' });
});

client.login(token);

