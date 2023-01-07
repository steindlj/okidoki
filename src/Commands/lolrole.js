const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lolrole')
        .setDescription('Decides role for given players.')
        .addStringOption(option => 
            option.setName('players')
                .setDescription('Players to play with.')
                .setRequired(true)),

    async execute(interaction) {
        let players = interaction.options.getString('players').split(/[, ]+/);
        if (players.length != 5) return await interaction.reply({ content: 'es müssen genau 5 Spieler angegeben werden!', ephemeral: true });
        await interaction.deferReply();

        let roles = ['TOPLANE', 'JUNGLE', 'MIDLANE', 'BOTLANE', 'SUPPORT'];
        let message = `**__Rollen: [${players.toString()}]__**`;

        for (let i = 0; i < roles.length; i++) {
            message += `\n**${roles[i]}:** ${role(players)}`;
        }
        await interaction.editReply(message);

        function role(players) {
            let index = Math.floor(Math.random() * players.length);
            let current = players[index];
            players.splice(index, 1);
            return current;
        }
    },
};
