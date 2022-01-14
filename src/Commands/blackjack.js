const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const Canvas = require('canvas');
const fs = require('fs');
const path = '../media/cards/';
const wait = require('util').promisify(setTimeout);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('blackjack')
		.setDescription('Play Blackjack!'),

	async execute(interaction) {
		let cards = fs.readdirSync('../media/cards').filter(file => file.endsWith('.png'));
		let playerHand = [];
		let dealerHand = [];
		let row = new MessageActionRow()
			.addComponents(
				new MessageButton()
				.setCustomId('hit')
				.setLabel('HIT')
				.setStyle('SUCCESS')
			)
			.addComponents(
				new MessageButton()
				.setCustomId('stand')
				.setLabel('STAND')
				.setStyle('DANGER')
			);
		let collector = interaction.channel.createMessageComponentCollector({ componentType: 'BUTTON' });
		dealingCards(playerHand);
		dealingCards(playerHand);
		dealingCards(dealerHand);
		await message(playerHand);
		collector.on('collect', async i => {
			if (i.user.id === interaction.user.id) {
				if (i.customId === 'hit') {
					i.update('HIT');
					dealingCards(playerHand);
					await message(playerHand);
				} else {
					i.update('__STAND__');
					collector.stop();
					dealingCards(dealerHand);
					await message(dealerHand);
					if (Array.isArray(handValue(dealerHand))) {
						while (handValue(dealerHand)[1] < 17) {
							wait(500);
							dealingCards(dealerHand);
							await message(dealerHand);
						}
						if (handValue(dealerHand)[1] > 21 && handValue(dealerHand)[0] < 17) {
							while (handValue(dealerHand)[0] < 17) {
								wait(500)
								dealingCards(dealerHand);
								await message(dealerHand);
							}
						}
					} else {
						while (handValue(dealerHand) < 17) {
							wait(500);
							dealingCards(dealerHand);
							await message(dealerHand);
						}
					}
					win();
				}
			} else {
				i.reply({ content: 'Not your game!', ephemeral: true });
			}
		});
		
		async function win() {
			await wait(500);
			let winEmbed = (hand) => {
				let title = hand === playerHand ? `${interaction.user.username} won!` : 'Dealer won!';
				let thumbnail = hand === playerHand ? 'attachment://player.png' : 'attachment://dealer.png';
				return new MessageEmbed()
					.setTitle(title)
					.setThumbnail(thumbnail)
					.setColor('GREEN')
					.setTimestamp()
					.addFields({ name: 'Value', value: handValue(hand).toString().replaceAll(',', ' or ') })
					.setFooter(interaction.user.username, interaction.user.displayAvatarURL());
			};
			let pushEmbed = new MessageEmbed()
				.setColor('GREY')
				.setTitle('PUSH')
				.setTimestamp()
				.setFooter(interaction.user.username, interaction.user.displayAvatarURL());
			let player = 0;
			let dealer = 0;
			if (Array.isArray(handValue(playerHand))) {
				let hand = handValue(playerHand);
				let len = hand.length-1;
				while (hand[len] > 21) {
					len--;
				}
				player = hand[len];
			} else {
				player = handValue(playerHand);
			};
			if (Array.isArray(handValue(dealerHand))) {
				let hand = handValue(dealerHand);
				let len = hand.length-1;
				while (hand[len] > 21) {
					len--;
				}
				dealer = hand[len];
			} else {
				dealer = handValue(dealerHand);
			};
			if (player == dealer) {
				let embed = winEmbed(playerHand);
				let image = await createCanvas(playerHand);
				if (playerHand.length > dealerHand.length) {
					embed = winEmbed(dealerHand);
					image = await createCanvas(dealerHand);
				}	
				if (player.length ==  dealer.length) {
					embed = pushEmbed;
					await interaction.followUp({ embeds: [embed] });
				};
				await interaction.followUp({ embeds: [embed], files: [image] });
			} else if (player <= 21 && dealer <= 21) {
				let embed = winEmbed(playerHand);
				let image = await createCanvas(playerHand);
				if (player < dealer) {
					embed = winEmbed(dealerHand);
					image = await createCanvas(dealerHand);
				}	
				await interaction.followUp({ embeds: [embed], files: [image] });
			} else if (player > 21 && dealer > 21) {
				let embed = winEmbed(playerHand);
				let image = await createCanvas(playerHand);
				if (player > dealer) {
					embed = winEmbed(dealerHand);
					image = await createCanvas(dealerHand);
				}	
				await interaction.followUp({ embeds: [embed], files: [image] });
			} else if (player > 21 && dealer <= 21) {
				let embed = winEmbed(dealerHand);
				let image = await createCanvas(dealerHand);
				await interaction.followUp({ embeds: [embed], files: [image] });
			} else if (player <= 21 && dealer > 21) {
				let embed = winEmbed(playerHand);
				let image = await createCanvas(playerHand);
				await interaction.followUp({ embeds: [embed], files: [image] });
			};
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
			};
        }

		async function message(hand) {
			wait(250);
			let color = 'GREEN';
			let title = `${interaction.user.username}\'s Hand`;
			if (Array.isArray(handValue(hand)) && handValue(hand)[0] > 21 || handValue(hand) > 21) {
				row.components[0].setDisabled(true);
				color = 'RED';
			};
			const handEmbed = (hand) => {
				let thumbnail = 'attachment://dealer.png';
				let image = 'attachment://player.png'
				let enemy = 'Dealer';
				let enemyValue = handValue(dealerHand).toString().replaceAll(',', ' or ')
				if (hand === dealerHand) {
					title = 'Dealer\'s Hand';
					image = 'attachment://dealer.png';
					thumbnail = 'attachment://player.png';
					enemy = 'Player';
					enemyValue = handValue(playerHand).toString().replaceAll(',', ' or ');
				};
				return new MessageEmbed()
					.setColor(color)
					.setTitle(title)
					.setThumbnail(thumbnail)
					.addFields(
					{ name: 'Value', value: handValue(hand).toString().replaceAll(',', ' or '), inline: true },
					{ name: enemy, value: enemyValue, inline: true }
					)
					.setImage(image)
					.setTimestamp()
					.setFooter(interaction.user.username, interaction.user.displayAvatarURL());
			};
			if (hand === playerHand && playerHand.length == 2) {
				await interaction.reply({ embeds: [handEmbed(hand)], files: [await createCanvas(hand), await createCanvas(dealerHand)], components: [row] });
			} else if (hand === playerHand) {
				interaction.channel.bulkDelete(1);
				await interaction.followUp({ embeds: [handEmbed(hand)], files: [await createCanvas(hand), await createCanvas(dealerHand)], components: [row] });
			} else if (hand === dealerHand) {
				if (hand.length > 2) interaction.channel.bulkDelete(1);
				await interaction.followUp({ embeds: [handEmbed(hand)], files: [await createCanvas(hand), await createCanvas(playerHand)] });
			};
		}

		function handValue(hand) {
			let value = 0; 
			let ace = [value];
			for (let i = 0; i < hand.length; i++) {
				if (!isNaN(hand[i].charAt(path.length))) {
					let cardValue = parseInt(hand[i].charAt(path.length)) == 1 ? 10 : parseInt(hand[i].charAt(path.length));
					if (ace.length > 1) {
						ace = ace.map(val => val + cardValue);
					} else {
						value += cardValue;
						ace.shift();
						ace.unshift(value);
					}
				} else if (hand[i].charAt(path.length) === 'a') {
					ace = ace.map(val => val + 1);
					ace.push(11 * ace.length + value);
				} else {
					if (ace.length > 1) {
						ace = ace.map(val => val + 10);
					} else {
						value += 10;
						ace.shift();
						ace.unshift(value);
					}
				}
			}
			return ace.length > 1 ? ace : value;
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
			};
			let name = hand === playerHand ? 'player.png' : 'dealer.png';
			return new MessageAttachment(canvas.toBuffer(), name);
		}
	},
};