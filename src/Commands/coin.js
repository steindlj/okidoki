const { SlashCommandBuilder } = require('@discordjs/builders');
const DiscordDB = require('../dbSchema.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coin')
        .setDescription('Coinflip!')
        .addSubcommand(subcommand =>
            subcommand.setName('play')
                .setDescription('Play Heads or Tails!')
                .addStringOption(option => 
                    option.setName('options')
                        .setDescription('Heads or Tails!')
                        .setRequired(true)
                        .addChoice('Heads', 'Heads')
                        .addChoice('Tails', 'Tails')))
        .addSubcommand(subcommand =>
            subcommand.setName('stats')
                .setDescription('Shows your coinflip stats!')),

    async execute(interaction) {
        let i = true;
        checkDB();
        if (interaction.options.getSubcommand() === 'play') {
            const coin = ['Heads', 'Tails'];
            const index = Math.floor(Math.random() * coin.length);
            const input = interaction.options.getString('options');
            const flip = coin[index] === input;
            if (flip) {
                DiscordDB.findOneAndUpdate({ userId: interaction.user.id }, { $inc: { coin_won: 1 } }, function (err, user) {
                    if(err) return handleError(err);
                    console.log(`Coin_won increased! (${interaction.user.username})`);
                }).clone();
            } else {
                DiscordDB.findOneAndUpdate({ userId: interaction.user.id }, { $inc: { coin_lost: 1 } }, function (err, user) {
                    if(err) return handleError(err);
                    console.log(`Coin_lost increased! (${interaction.user.username})`);
                }).clone();
            };
            await interaction.reply(`es wurde **"${coin[index]}"** geworfen! (${flip ? 'Gewonnen' : 'Verloren'})`);
        } else if (interaction.options.getSubcommand() === 'stats') {
            DiscordDB.findOne({ userId: interaction.user.id }, function(err, user) {
                if(err) return handleError(err);
                try {
                    interaction.channel.send({ embeds: [ user.stats(interaction) ] });
                } catch (error) {
                    
                }
                let msg = i ? 'Command ausgeführt' : 'Try again!';
                interaction.reply({ content: msg, ephemeral: true });
            });
        };

        function checkDB() {
            DiscordDB.findOne({ userId: interaction.user.id }, function (err, user) {
                if(err) return handleError(err);
                if(!user) {
                    DiscordDB.create({ userId: interaction.user.id });
                    console.log(`User ${interaction.user.username} added!`);
                    i = false;
                };
            });
        };
    },
};