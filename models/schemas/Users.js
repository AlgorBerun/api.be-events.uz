var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UsersSchema = new Schema({
	full_name: String,
	email: String,
	phone_number: String,
	accessToken: String,
	refreshToken: String,
	group: String,
	created_at: Number,
	status: String,
	ip: String,
	access_content: []
});

module.exports = mongoose.model('Users', UsersSchema, 'Users');