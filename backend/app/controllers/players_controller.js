const config = require("../config/auth_config");
const db = require("../models");
const Player = db.player;

exports.getPlayers = async (req, res) => {
    try {
        if (req.body.nationality === "") {
            const players = await Player.find({}).sort({ name: 1 });
            return res.status(200).json({ status: 'ok', players })
        } else {
            const players = await Player.find({ nationality: req.body.nationality }).sort({ name: 1 });
            return res.status(200).json({ status: 'ok', players })
        }

    }
    catch (err) { return res.status(422).json({ status: 'error', error: 'Error' }) }
}