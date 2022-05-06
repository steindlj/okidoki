const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('movechannel')
        .setDescription('Move all members from one channel to another!')
        .addChannelOption(option => 
            option.setName('from')
                .setDescription('From this channel.')
                .addChannelType(2)
                .setRequired(true))
        .addChannelOption(option => 
            option.setName('to')
                .setDescription('To this channel.')
                .addChannelType(2)
                .setRequired(true)),

    async execute(interaction) {
        let channelFrom = interaction.options.getChannel('from');
        let channelTo = interaction.options.getChannel('to');
        let members = channelFrom.members;
        members.each(user => user.setChannel(channelTo));
    }
}