const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Writes the content of the message!')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Content of the Message.')
                .setRequired(true)),

    async execute(interaction) {
        let message = interaction.options.getString('message');
        await interaction.channel.send(message);
        await interaction.reply({ content: 'Command ausgeführt!', ephemeral: true });
    },
};