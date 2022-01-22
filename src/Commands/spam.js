const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('spam')
        .setDescription('Writes a message repeatedly!')
        .setDefaultPermission(false)
        .addSubcommand(subcommand => 
            subcommand.setName('increase')
                .setDescription('Increases number of input per message.')
                .addStringOption(option => 
                    option.setName('message')
                        .setDescription('Message to spam.')
                        .setRequired(true))
                .addNumberOption(option => 
                    option.setName('number')
                        .setDescription('Amount to increase.')
                        .setRequired(true)))
        .addSubcommand(subcommand => 
            subcommand.setName('fixed')
                .setDescription('Repeats input for certain amount per message.')
                .addStringOption(option => 
                    option.setName('message')
                        .setDescription('Message to spam.')
                        .setRequired(true))
                .addNumberOption(option => 
                    option.setName('size')
                        .setDescription('Input amount per message.')
                        .setRequired(true))
                .addNumberOption(option => 
                    option.setName('number')
                        .setDescription('Number of messages.')
                        .setRequired(true))),

    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'increase') {
            let message = interaction.options.getString('message');
            let number = interaction.options.getNumber('number');
            let out = message;
            await interaction.reply(out);
            for (let i = 0; i < number; i++) {
                out += message;
                await interaction.followUp(out);
            }

        } else if (interaction.options.getSubcommand() === 'fixed') {
            let message = interaction.options.getString('message');
            let size = interaction.options.getNumber('size');
            let number = interaction.options.getNumber('number');
            let out = message;
            for (let i = 0; i < size-1; i++) {
                out += message;
            }
            await interaction.reply(out);
            for (let i = 0; i < number-1; i++) {
                await interaction.followUp(out);
            }
        }
        
    },
};