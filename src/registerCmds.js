const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { clientId, token } = require('../config.json');

const commands = [];
const commandFiles = fs.readdirSync('./Commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./Commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Refreshed!');

        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        );
        console.log('Reloaded!');
    } catch (error) {
        console.error(error);
    }
})();
