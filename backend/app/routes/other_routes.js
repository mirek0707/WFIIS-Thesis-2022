const controller = require("../controllers/clubs_controller");

module.exports = function (app) {

    app.post("/api/test/getClubs", controller.getClubs);
};
