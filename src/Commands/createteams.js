const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createteams')
        .setDescription('Distributes given players to teams!')
        .addNumberOption(option => 
            option.setName('number')
                .setDescription('Number of teams.')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('players')
                .setDescription('Players to play with.')
                .setRequired(true)),

    async execute(interaction) {
        let players = interaction.options.getString('players').split(' ');
        let number = interaction.options.getNumber('number');
        if (number < 2) {
            return await interaction.reply({ content: 'Es muss mindestens 2 Teams geben!', ephemeral: true });
        } else if (players.length < 2) {
            return await interaction.reply({ content: 'Es muss mindestens 2 Spieler geben!', ephemeral: true });
        } else if (players.length < number) {
            return await interaction.reply({ content: 'Du hast mehr Teams als Spieler!', ephemeral: true });
        }
        await interaction.deferReply();
        let sizeOfTeam = Math.floor(players.length / number);
        let leftPlayers = players.length - sizeOfTeam * number;
        let team;
        let message = `**__Generierte Teams: [${players.toString()}]__**`;
        
        for (let i = 0; i < number; i++) {
            team = [];
            for (let j = 0; j < sizeOfTeam; j++) {
                add(team, players);
            }
            if (leftPlayers > 0) {
                add(team, players);
            }
            message += `\n**Team ${i + 1}:** ${team.toString().replace(',', ' ')}`;
        }
        await interaction.editReply(message);

        function add(team, players) {
            let index = Math.floor(Math.random() * players.length);
            team.push(players[index]);
            players.splice(index, 1);
        }
    },
};
