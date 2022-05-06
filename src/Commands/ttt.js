const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('ttt')
        .setDescription('TicTacToe against someone!')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('Your enemy!')
                .setRequired(true)),

    async execute(interaction) {
        let user = interaction.user;
        let enemy = interaction.options.getUser('user');
        let firstrow;
        let secondrow;
        let thirdrow;
        let field = [{key: '0', value: ' '}, {key: '1', value: ' '}, {key: '2', value: ' '},
                     {key: '3', value: ' '}, {key: '4', value: ' '}, {key: '5', value: ' '},
                     {key: '6', value: ' '}, {key: '7', value: ' '}, {key: '8', value: ' '}];
        let symbol = Math.floor(Math.random() * 2);
        let playerX = symbol === 0 ? user : enemy;
        let playerO = playerX === user ? enemy : user;
        let turn = playerX.id;
        let collector = interaction.channel.createMessageComponentCollector({ componentType: 'BUTTON' });
        initRows();
        await interaction.reply({ content: `TicTacToe: ${playerX} (X) vs. ${playerO} (O)`, components: [firstrow, secondrow, thirdrow] });
        collector.on('collect', async i => {
            if ((i.user.id === user.id || i.user.id === enemy.id) && i.customId === 'Cancel') {
                i.update({ content: `TicTacToe: ${playerX} (X) vs. ${playerO} (O)\nCancelled!`, components: [firstrow, secondrow, thirdrow] });
                collector.stop();
            } else if (i.user.id === turn && i.component.label === ' ') {
                let button = field.find(button => button.key === i.component.customId);
                if (i.user.id === playerX.id) {
                    button.value = 'X';
                } else {
                    button.value = 'O';
                }
                initRows(); 
                if (checkWin()) {
                    collector.stop();
                    i.update({ content: `TicTacToe: ${playerX} (X) vs. ${playerO} (O)\n${i.user.username} won!`, components: [firstrow, secondrow, thirdrow] });
                } else if (emptyFields()) {
                    collector.stop();
                    i.update({ content: `TicTacToe: ${playerX} (X) vs. ${playerO} (O)\nDraw!`, components: [firstrow, secondrow, thirdrow] });
                } else {
                    turn = turn === playerX.id ? playerO.id : playerX.id;
                    i.update({ content: `TicTacToe: ${playerX} (X) vs. ${playerO} (O)`, components: [firstrow, secondrow, thirdrow] });
                };
            } else {
                i.update({ content: `TicTacToe: ${playerX} (X) vs. ${playerO} (O)\nTry again!`, components: [firstrow, secondrow, thirdrow] });
            }
        });

        function checkWin() {
            if (checkRows() || checkColumns() || checkDiagonals()) {
                return true;
            } else {
                return false;
            }
        }

        function checkRows() {
            if (field[0].value === field[1].value && field[1].value === field[2].value && field[0].value != ' ' || 
                field[3].value === field[4].value && field[4].value === field[5].value && field[3].value != ' ' ||
                field[6].value === field[7].value && field[7].value === field[8].value && field[6].value != ' ') {
                return true;
            } else {
                return false;
            }
        }

        function checkColumns() {
            if (field[0].value === field[3].value && field[3].value === field[6].value && field[0].value != ' ' || 
                field[1].value === field[4].value && field[4].value === field[7].value && field[1].value != ' ' ||
                field[2].value === field[5].value && field[5].value === field[8].value && field[2].value != ' ') {
                return true;
            } else {
                return false;
            }
        }

        function checkDiagonals() {
            if (field[0].value === field[4].value && field[4].value === field[8].value && field[0].value != ' ' || 
                field[2].value === field[4].value && field[4].value === field[6].value && field[2].value != ' ') {
                return true;
            } else {
                return false;
            }
        }

        function emptyFields() {
            const isEmpty = (currentField) => currentField.value != ' ';
            if (field.every(isEmpty)) {
                return true;
            } else {
                return false;
            }
        }

        function initRows() {
            let cancelButton = new MessageButton()
                .setCustomId('Cancel')
                .setLabel('CANCEL')
                .setStyle('DANGER');
            let style = (index) => {
                let style;
                if (field[index].value === ' ') {
                    style = 'SECONDARY';
                } else if (field[index].value === 'X') {
                    style = 'PRIMARY';
                } else {
                    style = 'SUCCESS';
                }
                return style;
            }
            firstrow = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId(field[0].key)
                    .setLabel(field[0].value)
                    .setStyle(style(0))
                )
                .addComponents(
                    new MessageButton()
                    .setCustomId(field[1].key)
                    .setLabel(field[1].value)
                    .setStyle(style(1))
                )
                .addComponents(
                    new MessageButton()
                    .setCustomId(field[2].key)
                    .setLabel(field[2].value)
                    .setStyle(style(2))
                );
            secondrow = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId(field[3].key)
                    .setLabel(field[3].value)
                    .setStyle(style(3))
                )
                .addComponents(
                    new MessageButton()
                    .setCustomId(field[4].key)
                    .setLabel(field[4].value)
                    .setStyle(style(4))
                )
                .addComponents(
                    new MessageButton()
                    .setCustomId(field[5].key)
                    .setLabel(field[5].value)
                    .setStyle(style(5))
                );
            thirdrow = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId(field[6].key)
                    .setLabel(field[6].value)
                    .setStyle(style(6))
                )
                .addComponents(
                    new MessageButton()
                    .setCustomId(field[7].key)
                    .setLabel(field[7].value)
                    .setStyle(style(7))
                )
                .addComponents(
                    new MessageButton()
                    .setCustomId(field[8].key)
                    .setLabel(field[8].value)
                    .setStyle(style(8)),
                )
                .addComponents(cancelButton);
        }
    },
};