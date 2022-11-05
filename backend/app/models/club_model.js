const mongoose = require("mongoose");

const Club = mongoose.model(
    "Club",
    new mongoose.Schema({
        name: {
            type: String,
            required: true,
            unique: true
        },
        nation: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true
        },
        year_founded: {
            type: Number,
            required: true
        }
    })
);

module.exports = Club;
