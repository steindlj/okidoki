const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dsize')
        .setDescription('Returns the size of your dick! (NSFW)'),

    async execute(interaction) {
        let chance = Math.floor(Math.random() * 100);
        let size;
        if (chance == 1) {
            size = 69;
        } else if (chance < 70) {
            size = Math.floor(Math.random() * 6) + 12;
        } else {
            size = Math.floor(Math.random() * 12) + 19;
        }
        let sizetoString = size < 15 ? 'mickrige' : 'unglaubliche';
        await interaction.reply(`dein Schwanz ist ${sizetoString} ***${size} cm*** lang!`);
    },
};