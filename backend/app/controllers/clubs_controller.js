const db = require("../models");
const Club = db.club;

exports.getClubs = async (req, res) => {
    try {
        if (req.body.nation === ""){
            const clubs = await Club.find({}).sort({ name: 1 });
            return res.status(200).json({ status: 'ok', clubs })
        } else {
            const clubs = await Club.find({ nation: req.body.nation }).sort({ name: 1 });
            return res.status(200).json({ status: 'ok', clubs })
        }
        
    }
    catch (err) { return res.status(422).json({ status: 'error', error: 'Error' }) }
}

exports.getClubsNames = async (req, res) => {
    try {
        const clubs = await Club.find({}, {name: 1}).sort({ name: 1 });
        return res.status(200).json({ status: 'ok', clubs })        
    }
    catch (err) { return res.status(422).json({ status: 'error', error: 'Error' }) }
}

exports.addClub = async (req, res) => {
    try {
        const club = await Club.create({
            name: req.body.name,
            nation: req.body.nation,
            city: req.body.city,
            year_founded: req.body.year_founded
        });
        return res.status(200).json({ status: 'ok', club });
    }
    catch (err) { return res.status(422).json({ status: 'error', error: 'Error' }) }
}