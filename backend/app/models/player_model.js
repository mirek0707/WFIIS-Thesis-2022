const mongoose = require("mongoose");

const Player = mongoose.model(
    "Player",
    new mongoose.Schema({
        name: {
            type: String,
            required: true,
        },
        surname: {
            type: String,
            required: true,
        },
        known_as: {
            type: String,
            required: false,
        },
        nationality: {
            type: String,
            required: true,
        },
        city_of_birth: {
            type: String,
            required: false
        },
        date_of_birth: {
            type: Date,
            required: true
        },
        position: {
            type: String,
            required: true
        },
        club: {
            type: String,
            required: true
        },
        number: {
            type: Number,
            required: true,
            min: 0,
            max: 99
        },
        height: {
            type: Number,
            required: true,
            min: 150,
            max: 230
        },
        weight: {
            type: Number,
            required: true,
            min: 50,
            max: 120
        }
    })
);

module.exports = Player;
