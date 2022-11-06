const club_controller = require("../controllers/clubs_controller");
const player_controller = require("../controllers/players_controller");

module.exports = function (app) {

    app.post("/api/test/getClubs", club_controller.getClubs);
    app.post("/api/test/getPlayers", player_controller.getPlayers);
};
