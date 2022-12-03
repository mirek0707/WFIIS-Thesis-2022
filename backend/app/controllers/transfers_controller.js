const db = require("../models");
const Transfer = db.transfer;

exports.getTransfers = async (req, res) => {
    try {
            if (req.body.season === "") {
                const transfers = await Transfer.find({}).sort({ date:-1 });
                return res.status(200).json({ status: 'ok', transfers });
            } else{
                const transfers = await Transfer.find({ season: req.body.season }).sort({ date: -1 });
                return res.status(200).json({ status: 'ok', transfers });
            }

    }
    catch (err) { return res.status(422).json({ status: 'error', error: 'Error' }) }
}

exports.getClubTransfers = async (req, res) => {
    try {
        const transfers = await Transfer.find({ "$or": [{ club_left: req.body.club }, { club_joined: req.body.club }], season: req.body.season }).sort({ date: -1 });
        return res.status(200).json({ status: 'ok', transfers });
    }
    catch (err) { return res.status(422).json({ status: 'error', error: 'Error' }) }
}

exports.getPlayerTransfers = async (req, res) => {
    try {
        const transfers = await Transfer.find({ player_id: req.body.player_id }).sort({ date: -1 });
        return res.status(200).json({ status: 'ok', transfers });
    }
    catch (err) { return res.status(422).json({ status: 'error', error: 'Error' }) }
}

exports.addTransfer = async (req, res) => {
    try {
        const transfer = await Transfer.create({ 
            player_id: req.body.player_id, 
            club_left: req.body.club_left, 
            club_joined: req.body.club_joined, 
            type: req.body.type, 
            fee: req.body.fee, 
            date: new Date(req.body.date), 
            season: req.body.season 
        });
        return res.status(200).json({ status: 'ok', transfer });
    }
    catch (err) { return res.status(422).json({ status: 'error', error: 'Error' }) }
}