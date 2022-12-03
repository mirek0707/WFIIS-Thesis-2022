const club_controller = require("../controllers/clubs_controller");
const player_controller = require("../controllers/players_controller");
const transfer_controller = require("../controllers/transfers_controller");
const video_controller = require("../controllers/videos_controller");

module.exports = function (app) {

    app.post("/api/test/getClubs", club_controller.getClubs);
    app.post("/api/test/getClubsNames", club_controller.getClubsNames);
    app.post("/api/test/getPlayers", player_controller.getPlayers);
    app.post("/api/test/getPlayersNames", player_controller.getPlayersNames);
    app.post("/api/test/getPlayersFromClub", player_controller.getPlayersFromClub);
    app.post("/api/test/getTransfers", transfer_controller.getTransfers);
    app.post("/api/test/getClubTransfers", transfer_controller.getClubTransfers);
    app.post("/api/test/getPlayerTransfers", transfer_controller.getPlayerTransfers);
    app.post("/api/test/addTransfer", transfer_controller.addTransfer);
    app.post("/api/test/addPlayer", player_controller.addPlayer);
    app.post("/api/test/addClub", club_controller.addClub);
    app.post("/api/test/getVideos", video_controller.getVideos);
};
