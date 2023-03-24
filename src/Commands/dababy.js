const { joinVoiceChannel, createAudioPlayer, StreamType, createAudioResource, AudioPlayerStatus } = require("@discordjs/voice");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { createReadStream } = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dababy')
		.setDescription('Plays Lets Go from DaBaby!'),

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });
		let voiceChannel = interaction.member.voice.channel;
		let connection = joinVoiceChannel({ 
			channelId: voiceChannel.id, 
			guildId: interaction.guild.id,  
			selfDeaf: false,
			adapterCreator: interaction.guild.voiceAdapterCreator 
		});
		let player = createAudioPlayer();
		let resource = createAudioResource(createReadStream('../media/sound/dababy.ogg', { inputType: StreamType.OggOpus }));
		player.play(resource);
		connection.subscribe(player);
		player.on(AudioPlayerStatus.Idle, () => {
			connection.destroy();
			interaction.editReply({ content: 'Command ausgeführt!', ephemeral: true });
		});
	},
};
