const { SlashCommandBuilder } = require('@discordjs/builders');
const {ChannelType} = require("discord-api-types/v10");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('movechannel')
        .setDescription('Move all members from one channel to another!')
        .addChannelOption(option => 
            option.setName('from')
                .setDescription('From this channel.')
                .addChannelTypes(ChannelType.GuildVoice)
                .setRequired(true))
        .addChannelOption(option => 
            option.setName('to')
                .setDescription('To this channel.')
                .addChannelTypes(ChannelType.GuildVoice)
                .setRequired(true)),

    async execute(interaction) {
        let channelFrom = interaction.options.getChannel('from');
        let channelTo = interaction.options.getChannel('to');
        let members = channelFrom.members;
        members.each(user => user.voice.setChannel(channelTo));
        await interaction.reply({ content: `All members were moved!`, ephemeral: true });
    }
}
