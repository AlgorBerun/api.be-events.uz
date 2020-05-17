var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var GroupsSchema = new Schema({
	name: String,
	access_content: []
});

module.exports = mongoose.model('Groups', GroupsSchema, 'Groups');