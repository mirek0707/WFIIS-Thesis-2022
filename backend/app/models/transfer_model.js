const mongoose = require("mongoose");

const Transfer = mongoose.model(
    "Transfer",
    new mongoose.Schema({
        player_id: {
            type: String,
            required: true,
            unique: false
        },
        club_left: {
            type: String,
            required: true,
        },
        club_joined: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        fee: {
            type: Number,
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        season: {
            type: String,
            required: true
        }
    })
);

module.exports = Transfer;
