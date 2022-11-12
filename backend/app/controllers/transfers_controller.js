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