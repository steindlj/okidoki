const { joinVoiceChannel, createAudioPlayer, StreamType, createAudioResource, AudioPlayerStatus } = require("@discordjs/voice");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { createReadStream } = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dababy')
		.setDescription('Plays Lets Go from DaBaby!'),

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });
		const img = [
		'https://media.pitchfork.com/photos/5c7d4c1b4101df3df85c41e5/1:1/w_600/Dababy_BabyOnBaby.jpg',
		'https://i1.sndcdn.com/artworks-mco907y2V3zzFloe-6uRwyw-t500x500.jpg',
		'https://i.redd.it/r3he2tzfl4u61.jpg',
		'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/eccecf5b-58df-4fb5-b1ca-a55568933bb6/deg8fye-faabd46d-5052-4425-8687-59d79b5d9a5c.png/v1/fill/w_1024,h_582,strp/dababy_car_by_heavy_swag_badass_deg8fye-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NTgyIiwicGF0aCI6IlwvZlwvZWNjZWNmNWItNThkZi00ZmI1LWIxY2EtYTU1NTY4OTMzYmI2XC9kZWc4ZnllLWZhYWJkNDZkLTUwNTItNDQyNS04Njg3LTU5ZDc5YjVkOWE1Yy5wbmciLCJ3aWR0aCI6Ijw9MTAyNCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.1nWxKVKtsRsUr5I2zsanyDyMpndfFOXQG_syeh73P-U',
		'https://media0.giphy.com/media/jpKN7DInuU2r6s8jpv/giphy.gif?cid=63e6b07ezzhca28jmjs9nv47pejyjmuz59ji2mryukaoxxsm&rid=giphy.gif&ct=g',
		'https://c.tenor.com/vktVPFhEvzQAAAAM/daceegee-dacg.gif',
		'https://media.tenor.com/images/f3dfd47716daf9e4ec0bc6763154dd93/tenor.gif',
		'https://media2.giphy.com/media/mPMG0sO3AAJaQKH9Xv/giphy.gif',
		'https://mtonews.com/.image/ar_4:3%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_1200/MTY5MjA1OTY1MDM4NTYwNTQ1/dababy-4.jpg'
		];
		const voiceChannel = interaction.member.voice.channel;
		const index = Math.floor(Math.random() * img.length);
		const connection = joinVoiceChannel({ 
			channelId: voiceChannel.id, 
			guildId: interaction.guild.id,  
			selfDeaf: false,
			adapterCreator: interaction.guild.voiceAdapterCreator 
		});
		const player = createAudioPlayer();
		const resource = createAudioResource(createReadStream('../media/sound/dababy.ogg', { inputType: StreamType.OggOpus }));
		player.play(resource);
		connection.subscribe(player);
		player.on(AudioPlayerStatus.Idle, () => {
			connection.destroy();
			interaction.channel.send({ content: `LETS GOOOO!`, files: [img[index]]});
			interaction.editReply({ content: 'Command ausgeführt!', ephemeral: true });
		});
	},
};
