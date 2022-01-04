const mongoose = require('mongoose');
const { Schema } = mongoose;
const { MessageEmbed } = require('discord.js');

const discordSchema = new Schema ({
    userId: { type: Number, required: true, unique: true },
    coin_won: { type: Number, default: 0 },
    coin_lost: { type: Number, default: 0 }
});

discordSchema.methods.stats = function(interaction) {
    const stats = (option) => { return `${option} (${Math.round((option/(this.coin_won+this.coin_lost))*100)}%)` };
    const coinEmbed = new MessageEmbed()
        .setColor('RANDOM')
        .setTitle('Heads or Tails Stats')
        .setAuthor(interaction.user.username)
        .setThumbnail(interaction.user.displayAvatarURL())
        .addFields(
            { name: 'Won', value: stats(this.coin_won) },
            { name: 'Lost', value: stats(this.coin_lost) }
        )
        .setTimestamp();
    return coinEmbed;
};

const DiscordDB = mongoose.model('DiscordDB', discordSchema);

module.exports = DiscordDB;