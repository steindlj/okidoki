const Discord = require('discord.js');
const fs = require('fs');
const { token, guildIdlol, guildIdF, mongodb } = require('../config.json');
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
    //client.application.commands.fetch().then(commands => {
        //for (const cmd of commands) {
            //console.table(cmd, ['id', 'name']);
        //}}
        //).catch(console.error);
    const date = new Date();
    console.log(`[${ date.toLocaleString('de-DE', { timeZone: 'CET' }) }] ${ client.user.username } ready!`);
    client.user.setActivity('mit dir!', { type: 'PLAYING' });
    updatePermission(client, guildIdlol);
    //updatePermission(client, guildIdF);
    mongoose.connect(mongodb)
        .then(() => {
            console.log('Connected to DB!');
        })
        .catch((err) => {
            console.log(err);
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

function updatePermission(client, guildId) {
    let fullPermissions = [];
    if (guildId === guildIdlol) {
        fullPermissions = [
        {
            id: '920343276941348894',
            permissions: [{
                id: '596776462657388545',
                type: 'ROLE',
                permission: true,
            }],
        },
        {
            id: '920343276941348901',
            permissions: [{
                id: '596776462657388545',
                type: 'ROLE',
                permission: true,
            }],
        },
    ];
    } else if (guildId === guildIdF) {
        fullPermissions = [
            {
                id: '920343276941348894',
                permissions: [
                {
                    id: '851167029279850506',
                    type: 'ROLE',
                    permission: true,
                },
                {
                    id: '249553273621708812',
                    type: 'USER',
                    permission: true,
                }
                ],
            },
            {
                id: '920343276941348901',
                permissions: [
                {
                    id: '851167029279850506',
                    type: 'ROLE',
                    permission: true,
                },
                {
                    id: '249553273621708812',
                    type: 'USER',
                    permission: true,
                }
                ],
            },
        ];
    }
    client.guilds.cache.get(guildId).commands.permissions.set({ fullPermissions });
};

client.login(token);
