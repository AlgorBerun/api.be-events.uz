var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var AdminSchema = new Schema({
	full_name: String,
	phone_number: String,
	accessToken: String,
	refreshToken: String
});

module.exports = mongoose.model('Admin', AdminSchema, 'Admin');