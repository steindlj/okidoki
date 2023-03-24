const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder } = require('@discordjs/builders');
const {EmbedBuilder, Colors, AttachmentBuilder} = require('discord.js');
const Canvas = require('canvas');
const fs = require('fs');
const {ButtonStyle, ComponentType} = require("discord-api-types/v10");
const path = '../media/cards/';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('blackjack')
		.setDescription('Play Blackjack!'),

	async execute(interaction) {
		let cards = fs.readdirSync('../media/cards').filter(file => file.endsWith('.png'));
		let playerHand = [];
		let dealerHand = [];
		let msg;
		let row = new ActionRowBuilder()
			.addComponents([
				new ButtonBuilder()
					.setCustomId('hit')
					.setLabel('HIT')
					.setStyle(ButtonStyle.Primary),
				new ButtonBuilder()
					.setCustomId('stand')
					.setLabel('STAND')
					.setStyle(ButtonStyle.Danger)]
			);
		let collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.Button });
		await init();
		collector.on('collect', async i => {
			if (i.user.id === interaction.user.id) {
				if (i.customId === 'hit') {
					await updateHand(playerHand);
				} else {
					collector.stop();
					await updateHand(dealerHand);
					if (Array.isArray(handValue(dealerHand))) {
						while (handValue(dealerHand)[0] < 17) {
							await wait(500);
							await updateHand(dealerHand);
						}
					} else {
						while (handValue(dealerHand) < 17) {
							await wait(500);
							await updateHand(dealerHand);
						}
					}
					await win();
				}
			} else {
				await i.reply({ content: 'Not your game!', ephemeral: true });
			}
		});

		async function init() {
			dealingCards(playerHand);
			dealingCards(playerHand);
			dealingCards(dealerHand);
			await message(playerHand);
		}

		async function updateHand(hand) {
			dealingCards(hand);
			await message(hand);
		}

		async function createCanvas(hand) {
			let cardWidth = 63;
			let cardHeight = 91;
			let amount = hand.length;
			if (hand.length == 1) amount = 2;
			let canvas = Canvas.createCanvas(cardWidth*amount, cardHeight);
			let context = canvas.getContext('2d');
			let start = 0;
			let cardImage = null;
			for (let i = 0; i < hand.length; i++) {
				cardImage = await Canvas.loadImage(hand[i]);
				context.drawImage(cardImage, start, 0, cardWidth, cardHeight);
				start += cardWidth;
				if (hand.length == 1) {
					cardImage = await Canvas.loadImage(path+'back/back.png');
					context.drawImage(cardImage, start, 0, cardWidth, cardHeight);
				}
			}
			let name = hand === playerHand ? 'player.png' : 'dealer.png';
			return new AttachmentBuilder(canvas.toBuffer(), { name: name });
		}

		async function win() {
			await wait(500);
			let player;
			let dealer;
			if (Array.isArray(handValue(playerHand))) {
				let hand = handValue(playerHand);
				let len = hand.length-1;
				while (hand[len] > 21) {
					len--;
				}
				player = hand[len];
			} else {
				player = handValue(playerHand);
			}
			if (Array.isArray(handValue(dealerHand))) {
				let hand = handValue(dealerHand);
				let len = hand.length-1;
				while (hand[len] > 21) {
					len--;
				}
				dealer = hand[len];
			} else {
				dealer = handValue(dealerHand);

			}
			if (player === dealer) {
				if (playerHand.length === dealerHand.length) {
					msg.edit({ content: "Player won!", components: [] });
				} else {
					if (playerHand.length > dealerHand.length) msg.edit({ content: "Dealer won!", components: [] });
					else msg.edit({ content: "Player won!", components: [] });
				}
			} else if (player <= 21 && dealer <= 21) {
				if (player < dealer) msg.edit({ content: "Dealer won!", components: [] });
				else msg.edit({ content: "Player won!", components: [] });
			} else if (player > 21 && dealer > 21) {
				if (player > dealer) msg.edit({ content: "Dealer won!", components: [] });
				else msg.edit({ content: "Player won!", components: [] });
			} else {
				if (player < dealer) msg.edit({ content: "Player won!", components: [] });
				else msg.edit({ content: "Dealer won!", components: [] });
			}
		}

		function dealingCards(hand) {
            let index = Math.floor(Math.random() * cards.length);
            let current = cards[index];
			let img = path + current;
            cards.splice(index, 1);
			if (hand === playerHand) {
				hand.push(img);
			} else if (hand === dealerHand) {
				hand.push(img);
			}
        }

		async function handEmbed(hand, color) {
				let title, thumbnail, image, enemy, enemyValue;
				if (hand === playerHand) {
					title = 'Player\'s Hand';
					thumbnail = 'attachment://dealer.png';
					image = 'attachment://player.png'
					enemy = 'Dealer';
					enemyValue = handValue(dealerHand).toString().replaceAll(',', ' or ');
				} else {
					title = 'Dealer\'s Hand';
					image = 'attachment://dealer.png';
					thumbnail = 'attachment://player.png';
					enemy = 'Player';
					enemyValue = handValue(playerHand).toString().replaceAll(',', ' or ');
				}
				return new EmbedBuilder()
					.setColor(color)
					.setTitle(title)
					.setThumbnail(thumbnail)
					.addFields([
						{ name: 'Value', value: handValue(hand).toString().replaceAll(',', ', '), inline: true },
						{ name: enemy, value: enemyValue, inline: true }]
					)
					.setImage(image)
					.setTimestamp()
					.setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() });
		}

		async function message(hand) {
			await wait(250);
			let color = Colors.Green;
			if (Array.isArray(handValue(hand)) && handValue(hand)[0] > 21 || handValue(hand) > 21) {
				row.components[0].setDisabled(true);
				color = Colors.Red;
			}
			if (hand === playerHand && playerHand.length === 2) {
				msg = await interaction.reply({ embeds: [await handEmbed(hand, color)], files: [await createCanvas(hand), await createCanvas(dealerHand)], components: [row] });
			} else if (hand === playerHand) {
				msg.edit({ embeds: [await handEmbed(hand, color)], files: [await createCanvas(hand), await createCanvas(dealerHand)], components: [row] });
			} else if (hand === dealerHand) {
				msg.edit({ embeds: [await handEmbed(hand, color)], files: [await createCanvas(hand), await createCanvas(playerHand)], components: [] });
			}
		}

		function handValue(hand) {
			let value = 0;
			let aces = 0;
			let valAces = [];
			for (let i = 0; i < hand.length; i++) {
				if (!isNaN(hand[i].charAt(path.length))) {
					if (hand[i].charAt(path.length) == '1') value += 10;
					else value += parseInt(hand[i].charAt(path.length));
				} else {
					if (hand[i].charAt(path.length) == 'a') {
						value += 1; aces += 1;
					} else {
						value += 10;
					}
				}
			}
			for (let i = 0; i < aces+1; i++) {
				valAces.push(value+i*10);
			}
			return aces > 0 ? valAces : value;
		}

		function wait(milliseconds) {
			return new Promise((resolve) => setTimeout(resolve, milliseconds));
		}
	}
}
