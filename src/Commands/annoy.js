const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('annoy')
		.setDescription('Annoys user by invading the channel several times!')
		.setDefaultPermission(false)
		.addChannelOption(option => 
			option.setName('channel')
			.setDescription('Channel to be annoyed.')
			.addChannelType(2)
			.setRequired(true)),

	async execute(interaction) {
			await interaction.deferReply({ ephemeral: true });
			const channel = interaction.options.getChannel('channel');
			reconnect();
			for (let i = 0; i < 10000; i++) {
				annoy();
			}
			await interaction.editReply({ content: `Channel ${channel} wurde attackiert!`, ephemeral: true });
			function reconnect() {
				const connection = joinVoiceChannel({
					channelId: channel.id,
					guildId: interaction.guild.id,
					selfDeaf: false,
					adapterCreator: interaction.guild.voiceAdapterCreator,
				});
				connection.destroy();
			}
			function annoy() {
				setTimeout(function() {
					reconnect();
				}, 400);
			}
	},
};