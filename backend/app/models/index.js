const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user_model");
db.role = require("./role_model");
db.club = require("./club_model");
db.player = require("./player_model");
db.transfer = require("./transfer_model");

db.ROLES = ["user", "admin"];

module.exports = db;
