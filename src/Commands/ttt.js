const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder} = require('@discordjs/builders');
const {ButtonStyle, ComponentType} = require("discord-api-types/v10");

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
        let firstRow;
        let secondRow;
        let thirdRow;
        let field = [{key: '0', value: '_'}, {key: '1', value: '_'}, {key: '2', value: '_'},
                     {key: '3', value: '_'}, {key: '4', value: '_'}, {key: '5', value: '_'},
                     {key: '6', value: '_'}, {key: '7', value: '_'}, {key: '8', value: '_'}];
        let symbol = Math.floor(Math.random() * 2);
        let playerX = symbol === 0 ? user : enemy;
        let playerO = playerX === user ? enemy : user;
        let turn = playerX.id;
        let collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.Button });
        await initRows();
        await interaction.reply({ content: `TicTacToe: ${playerX} (X) vs. ${playerO} (O)`, components: [firstRow, secondRow, thirdRow] });
        collector.on('collect', async i => {
            if ((i.user.id === user.id || i.user.id === enemy.id) && i.customId === 'Cancel') {
                i.update({ content: `TicTacToe: ${playerX} (X) vs. ${playerO} (O)\nCancelled!`, components: [firstRow, secondRow, thirdRow] });
                collector.stop();
            } else if (i.user.id === turn && i.component.label === '_') {
                let button = field.find(button => button.key === i.component.customId);
                if (i.user.id === playerX.id) {
                    button.value = 'X';
                } else {
                    button.value = 'O';
                }
                await initRows();
                if (checkWin()) {
                    collector.stop();
                    i.update({ content: `TicTacToe: ${playerX} (X) vs. ${playerO} (O)\n${i.user.username} won!`, components: [firstRow, secondRow, thirdRow] });
                } else if (emptyFields()) {
                    collector.stop();
                    i.update({ content: `TicTacToe: ${playerX} (X) vs. ${playerO} (O)\nDraw!`, components: [firstRow, secondRow, thirdRow] });
                } else {
                    turn = turn === playerX.id ? playerO.id : playerX.id;
                    i.update({ content: `TicTacToe: ${playerX} (X) vs. ${playerO} (O)`, components: [firstRow, secondRow, thirdRow] });
                }
            }
        });

        function checkWin() {
            return checkRows() || checkColumns() || checkDiagonals();
        }

        function checkRows() {
            return field[0].value === field[1].value && field[1].value === field[2].value && field[0].value !== '_' ||
                field[3].value === field[4].value && field[4].value === field[5].value && field[3].value !== '_' ||
                field[6].value === field[7].value && field[7].value === field[8].value && field[6].value !== '_';
        }

        function checkColumns() {
            return field[0].value === field[3].value && field[3].value === field[6].value && field[0].value !== '_' ||
                field[1].value === field[4].value && field[4].value === field[7].value && field[1].value !== '_' ||
                field[2].value === field[5].value && field[5].value === field[8].value && field[2].value !== '_';
        }

        function checkDiagonals() {
            return field[0].value === field[4].value && field[4].value === field[8].value && field[0].value !== '_' ||
                field[2].value === field[4].value && field[4].value === field[6].value && field[2].value !== '_';
        }

        function emptyFields() {
            const isEmpty = (currentField) => currentField.value !== '_';
            return field.every(isEmpty);
        }

        async function initRows() {
            let cancelButton = new ButtonBuilder()
                .setCustomId('Cancel')
                .setLabel('CANCEL')
                .setStyle(ButtonStyle.Danger);
            let style = (index) => {
                let style;
                if (field[index].value === '_') {
                    style = ButtonStyle.Secondary;
                } else if (field[index].value === 'X') {
                    style = ButtonStyle.Primary;
                } else {
                    style = ButtonStyle.Success;
                }
                return style;
            }

            firstRow = new ActionRowBuilder()
                .addComponents([
                    new ButtonBuilder()
                        .setCustomId(field[0].key)
                        .setLabel(field[0].value)
                        .setStyle(style(0)),
                    new ButtonBuilder()
                        .setCustomId(field[1].key)
                        .setLabel(field[1].value)
                        .setStyle(style(1)),
                    new ButtonBuilder()
                        .setCustomId(field[2].key)
                        .setLabel(field[2].value)
                        .setStyle(style(2))]
                );
            secondRow = new ActionRowBuilder()
                .addComponents([
                    new ButtonBuilder()
                        .setCustomId(field[3].key)
                        .setLabel(field[3].value)
                        .setStyle(style(3)),
                    new ButtonBuilder()
                        .setCustomId(field[4].key)
                        .setLabel(field[4].value)
                        .setStyle(style(4)),
                    new ButtonBuilder()
                        .setCustomId(field[5].key)
                        .setLabel(field[5].value)
                        .setStyle(style(5))
                ]);
            thirdRow = new ActionRowBuilder()
                .addComponents([
                    new ButtonBuilder()
                        .setCustomId(field[6].key)
                        .setLabel(field[6].value)
                        .setStyle(style(6)),
                    new ButtonBuilder()
                        .setCustomId(field[7].key)
                        .setLabel(field[7].value)
                        .setStyle(style(7)),
                    new ButtonBuilder()
                        .setCustomId(field[8].key)
                        .setLabel(field[8].value)
                        .setStyle(style(8)),
                    cancelButton
                ]);
        }
    },
};