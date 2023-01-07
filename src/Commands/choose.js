const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('choose')
		.setDescription('Chooses one of many options!')
		.addStringOption(option => 
		    option.setName('options')
			.setDescription('Options to choose from!')
			.setRequired(true)),

    async execute(interaction) {
        let options = interaction.options.getString('options').split(/[, ]+/);
        let index = Math.floor(Math.random() * options.length);
        await interaction.reply(`Chosen: ${options[index]}`);
    },
};
    
