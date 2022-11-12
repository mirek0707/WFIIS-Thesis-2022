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