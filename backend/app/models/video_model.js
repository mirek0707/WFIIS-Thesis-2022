const mongoose = require("mongoose");

const Video = mongoose.model(
    "Video",
    new mongoose.Schema({
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true
        }
    })
);

module.exports = Video;
