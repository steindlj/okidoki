const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const { token, mongodb, url } = require('../config.json');
const mongoose = require('mongoose').default;
const {ActivityType} = require("discord-api-types/v10");
const fetch = require('node-fetch');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

client.commands = new Collection();

const commandFiles = fs.readdirSync('./Commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./Commands/${file}`);
    client.commands.set(command.data.name, command);
}

client.once('ready', () => {
    client.application.commands.fetch().then(commands => {
        for (const cmd of commands) {
            console.table(cmd, ['id', 'name']);
        }}
        ).catch(console.error);
    const date = new Date();
    console.log(`[${ date.toLocaleString('de-DE', { timeZone: 'CET' }) }] ${ client.user.username } ready!`);
    client.user.setActivity('in die Ferne!', { type: ActivityType.Watching });
    mongoose.connect(mongodb).
        then(() => {
            console.log('Connected to DB!');
        })
        .catch((err) => {
            console.log(err);
        });
});

client.on('voiceStateUpdate', (oldState, newState) => {
    if(oldState.member.user.id !== "249553273621708812") return;
    let muted = newState.mute;
    fetch(`${url}/${muted}`, {
	body: "Content-Length: 0",
	headers: {
		"Content-Type": "application/x-www-form-urlencoded"
	},
	method: "PUT"
    });
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const cmd = client.commands.get(interaction.commandName);

    if (!cmd) return;

    try {
        await cmd.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Error!', ephemeral: true });
    }
});

client.login(token);
