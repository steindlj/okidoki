const { SlashCommandBuilder } = require('@discordjs/builders');
const DiscordDB = require('../dbSchema.js');
const {EmbedBuilder, Colors} = require("discord.js");

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
                        .addChoices(
                            { name: 'Heads', value: 'Heads' },
                            { name: 'Tails', value: 'Tails'}
                        )))
        .addSubcommand(subcommand =>
            subcommand.setName('stats')
                .setDescription('Shows your coinflip stats!')),

    async execute(interaction) {
        await checkDB();
        await wait(250);
        if (interaction.options.getSubcommand() === 'play') {
            let coin = ['Heads', 'Tails'];
            let index = Math.floor(Math.random() * coin.length);
            let input = interaction.options.getString('options');
            let flip = coin[index] === input;
            if (flip) {
                let user = await DiscordDB.findOneAndUpdate({ userId: interaction.user.id }, { $inc: { coin_won: 1 } });
                if (user) console.log(`Coin_won increased! (${interaction.user.username} | ${user})`);
                else await interaction.reply({ content: 'Error', ephemeral: true });
            } else {
                let user = await DiscordDB.findOneAndUpdate({ userId: interaction.user.id }, { $inc: { coin_lost: 1 } });
                if (user) console.log(`Coin_won increased! (${interaction.user.username} | ${user})`);
                else await interaction.reply({ content: 'Error', ephemeral: true });
            }
            await interaction.reply(`es wurde **"${coin[index]}"** geworfen! (${flip ? 'Gewonnen' : 'Verloren'})`);
        } else if (interaction.options.getSubcommand() === 'stats') {
            let entry = await DiscordDB.findOne({ userId: interaction.user.id }).exec();
            if (entry) interaction.channel.send({ embeds: [statsEmbed(entry)] });
            let msg = entry ? 'Command executed!' : 'No stats found!';
            await interaction.reply({ content: msg, ephemeral: true });
        }

        async function checkDB() {
            let userInDB = await DiscordDB.findOne({userId: interaction.user.id}).exec() != null;
            if (!userInDB) {
                await DiscordDB.create({userId: interaction.user.id});
                console.log(`User ${interaction.user.username} added!`);
            }
        }
        function wait(milliseconds) {
            return new Promise((resolve) => setTimeout(resolve, milliseconds));
        }

        function statsEmbed(user) {
            const stats = (option) => { return `${option} (${Math.round((option/(user.coin_won+user.coin_lost))*100)}%)` };
            return new EmbedBuilder()
                .setColor(Colors.White)
                .setTitle('Heads or Tails Stats')
                .setAuthor({ name: interaction.user.username })
                .setThumbnail(interaction.user.displayAvatarURL())
                .addFields([
                    { name: 'Won', value: stats(user.coin_won) },
                    { name: 'Lost', value: stats(user.coin_lost)}]
                )
                .setTimestamp();
        }
    }
}
