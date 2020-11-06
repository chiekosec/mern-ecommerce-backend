const Product = require('../models/product');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');

exports.getProductById = (req, res, next, id) => {
	Product.findById(id)
	.populate("category")
	.exec((err, product) => {
		if(err){
			return res.status(400).json({
				error: "product not found"
			})
		}

		req.product = product;
		next();
	});
};

exports.createProduct = (req, res) => {
	let form = new formidable.IncomingForm();
	form.keepExtensions = true;

	form.parse(req, (err, fields, file) => {
		if (err) {
			return res.status(400).json({
				error: "problem with image"
			})
		}

		const { name, description, price, category, stock } = fields;
		if (!name || !description || !price || !category || !stock) {
			return res.status(400).json({
				error: "please provide all fields"
			});
		};

		let product = new Product(fields);

		if(file.photo) {
			if(file.photo.size > 3000000) {
				return res.status(400).json({
					error: "file size too big"
				})
			}

			product.photo.data = fs.readFileSync(file.photo.path);
			product.photo.contentType = file.photo.type;
		}

		//save to DB
		product.populate("category").save((err, product) => {
			if (err) {
				return res.status(400).json({
					error: "saving data to DB failed"
				})
			}

			res.json(product);
		})
	})
}

exports.getProduct = (req, res) => {
	req.product.photo = undefined;
	return res.json(req.product);
}

exports.photo = (req, res, next) => {
	if(req.product.photo.data) {
		res.set('content-Type', req.product.photo.contentType);
		return res.send(req.product.photo.data);
	}
	next();
}

exports.deleteProduct = (req, res) => {
	let product = req.product;
	product.remove((err, deletedProduct) => {
		if (err) {
			return res.status(400).json({
				error: "failed to delete product"
			})
		}
		res.json({
			message: "deletion successful"
		})
	})
}

exports.updateProduct = (req, res) => {
	let form = new formidable.IncomingForm();
	form.keepExtensions = true;

	form.parse(req, (err, fields, file) => {
		if (err) {
			return res.status(400).json({
				error: "problem with image"
			})
		}

		let product = req.product;
		Object.assign(product, fields);

		if(file.photo) {
			if(file.photo.size > 3000000) {
				return res.status(400).json({
					error: "file size too big"
				})
			}

			product.photo.data = fs.readFileSync(file.photo.path);
			product.photo.contentType = file.photo.type;
		}

		//save to DB
		product.save((err, product) => {
			if (err) {
				return res.status(400).json({
					error: "updation failed"
				})
			}

			res.json(product);
		})
	})
}

exports.getAllProducts = (req, res) => {
	let limit = req.query.limit ? parseInt(req.query.limit) : 8;
	let sortby = req.query.sortby ? req.query.sortby : "_id";

	Product.find()
	.select('-photo')
	.populate('category')
	.limit(limit)
	.sort([[sortby, "asc"]])
	.exec((err, products) => {
		if(err) {
			return res.status(400).json({
				error: "No products found"
			})
		}

		res.json(products)
	})
}

exports.updateStock = (req, res, next) => {
	let operations = req.body.order.products.map(item => {
		return {
			updateOne: {
				filter: {_id: item._id},
				update: {$inc: {stock: -item.count, sold: +item.count}}
			}
		}
	});
	Product.bulkWrite(operations, {}, (err, results) => {
		if(err) {
			return res.status(400).json({
				error: "Bulk operation failed"
			})
		}
		next();
	})
}