const mongoose = require('mongoose');
const { Schema } = mongoose;

const discordSchema = new Schema ({
    userId: { type: Number, required: true, unique: true },
    coin_won: { type: Number, default: 0 },
    coin_lost: { type: Number, default: 0 }
});

const DiscordDB = mongoose.model('DiscordDB', discordSchema);

module.exports = DiscordDB;