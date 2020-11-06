const mongoose = require("mongoose");

const { Schema } = mongoose;

const categorySchema = new Schema({
	name: {
		type: String,
		trim: true,
		required: true,
		maxlength: 32,
		unique: true
	}
}, {timeStamps: true})

module.exports = mongoose.model('Category', categorySchema)