const db = require("../models");
const Video = db.video;

exports.getVideos = async (req, res) => {
    try {
        const name = `\"${(req.body.known_as === "" ? req.body.surname : req.body.known_as)}\"`
        const option = `\"${(req.body.option)}\"`
        if (req.body.club === "" && req.body.option === "") {
            const videos = await Video.find({ $text: { $search: name } }, { score: { $meta: "textScore" } }).sort({ score: { $meta: "textScore" } });
            return res.status(200).json({ status: 'ok', videos })
        } else if (req.body.club === "") {
            const videos = await Video.find({ $text: { $search: name + " " + option } }, { score: { $meta: "textScore" } }).sort({ score: { $meta: "textScore" } });
            return res.status(200).json({ status: 'ok', videos })
        } else if (req.body.club === "") {
            const videos = await Video.find({ $text: { $search: name + " " + req.body.club } }, { score: { $meta: "textScore" } }).sort({ score: { $meta: "textScore" } });
            return res.status(200).json({ status: 'ok', videos })
        } else {
            const videos = await Video.find({ $text: { $search: name + " " + option + " " + req.body.club } }, { score: { $meta: "textScore" } }).sort({ score: { $meta: "textScore" } });
            return res.status(200).json({ status: 'ok', videos })
        }

    }
    catch (err) { return res.status(422).json({ status: 'error', error: 'Error' }) }
}