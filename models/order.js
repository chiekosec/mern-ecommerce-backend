const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;
const {Schema} = mongoose;

const productCartSchema = new Schema({
	product: {
		type: ObjectId,
		ref: "Product"
	},
	name: String,
	count: Number,
	price: Number,

})

const orderSchema = new Schema({
	products: [productCartSchema],
	transaction_id: {},
	amount: Number,
	address: String,
	updated: Date,
	status: {
		type: String,
		default: "Recieved",
		enum: ["Cancelled", "Delivered", "Shipped", "Recieved", "Processing"]
	},
	user: {
		type: ObjectId,
		ref: "User"
	}
}, {timeStamps: true})

const Order = mongoose.model('Order', orderSchema)
const ProductCart = mongoose.model('ProductCart', productCartSchema)

module.exports = {Order, ProductCart}