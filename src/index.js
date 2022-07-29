const Discord = require('discord.js');
const fs = require('fs');
const { token, mongodb, url } = require('../config.json');
const mongoose = require('mongoose');

const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_VOICE_STATES] });
client.options.retryLimit = Infinity;

client.commands = new Discord.Collection();

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
    client.user.setActivity('mit dir!', { type: 'PLAYING' });
    mongoose.connect(mongodb)
        .then(() => {
            console.log('Connected to DB!');
        })
        .catch((err) => {
            console.log(err);
        });
});

client.on('voiceStateUpdate', (oldState, newState) => {
    if(oldState.member.user.id !== "249553273621708812") return;
    let muted = newState.mute == true ? true : false;
    fetch(`${url}/${muted}`, {
	body: "Content-Length: 0",
	headers: {
		"Content-Type": "application/x-www-form-urlencoded"
	},
	method: "POST"
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
