exports.allAccess = (req, res) => {
    res.status(200).send("Publiczna zawartość.");
};

exports.userBoard = (req, res) => {
    res.status(200).send("Zawartość użytkownika.");
};

exports.adminBoard = (req, res) => {
    res.status(200).send("Zawartość administratora.");
};