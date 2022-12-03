const db = require("../models");
const Player = db.player;

exports.getPlayers = async (req, res) => {
    try {
        if (req.body.nationality === "" && req.body.position === "") {
            const players = await Player.find({}).sort({ surname: 1 });
            return res.status(200).json({ status: 'ok', players })
        } else if (req.body.position === "") {
            const players = await Player.find({ nationality: req.body.nationality }).sort({ surname: 1 });
            return res.status(200).json({ status: 'ok', players })
        } else if (req.body.nationality === "") {
            const players = await Player.find({ position: req.body.position }).sort({ surname: 1 });
            return res.status(200).json({ status: 'ok', players })
        } else {
            const players = await Player.find({ position: req.body.position, nationality: req.body.nationality }).sort({ surname: 1 });
            return res.status(200).json({ status: 'ok', players })
        }

    }
    catch (err) { return res.status(422).json({ status: 'error', error: 'Error' }) }
}

exports.getPlayersFromClub = async (req, res) => {
    try {
        const players = await Player.find({ club: req.body.club }).sort({ surname: 1 });
        return res.status(200).json({ status: 'ok', players })
    }
    catch (err) { return res.status(422).json({ status: 'error', error: 'Error' }) }
}

exports.getPlayersNames = async (req, res) => {
    try {
        const players = await Player.find({}, { name: 1, surname: 1, known_as: 1, nationality: 1 }).sort({ surname: 1 });
        return res.status(200).json({ status: 'ok', players })
    }
    catch (err) { return res.status(422).json({ status: 'error', error: 'Error' }) }
}

exports.addPlayer = async (req, res) => {
    try {
        const player = await Player.create({
            name: req.body.name,
            surname: req.body.surname,
            known_as: req.body.known_as,
            nationality: req.body.nationality,
            city_of_birth: req.body.city_of_birth,
            date_of_birth: new Date(req.body.date_of_birth),
            position: req.body.position,
            club: req.body.club,
            number: req.body.number,
            height: req.body.height,
            weight: req.body.weight
        });
        return res.status(200).json({ status: 'ok', player });
    }
    catch (err) { return res.status(422).json({ status: 'error', error: 'Error' }) }
}