const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const productSchema = new Schema({
	name: {
		type: String,
		required: true,
		maxlength: 32,
		trim: true,
	},
	description: {
		type: String,
		trim: true,
		required: true
	},
	price: {
		type: Number,
		required: true,
		maxlength: 10,
		trim: true
	},
	category: {
		type: ObjectId,
		ref: "Category",
		required: true
	},
	stock: {
		type: Number,

	},
	sold: {
		type: Number,
		default: 0
	},
	photo: {
		data: Buffer,
		contentType: String
	}
}, {timestamps: true})

module.exports = mongoose.model("Product", productSchema);