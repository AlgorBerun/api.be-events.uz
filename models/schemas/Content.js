var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ContentSchema = new Schema({
	name: String,
	created_at: Number,
	src: String,
	section: String, // qisqacha ma'lumot
	text_content: String, // to'liq ma'lumotlar
	src: String,
	poster_src: String,
	click_count: Number
});

module.exports = mongoose.model('Content', ContentSchema, 'Content');