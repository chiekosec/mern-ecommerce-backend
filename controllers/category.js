const Category = require('../models/category')

exports.getCategoryById = (req, res, next, id) => {
	Category.findById(id).exec((err, category) => {
		if (err) {
			return res.status(400).json({
				error: "category not found"
			})
		}
		req.category = category;
		next();
	});
};

exports.createCategory = (req, res) => {
	const category = new Category(req.body);
	category.save((err, category) => {
		if(err){
			return res.status(400).json({
				error: "unable to save category"
			})
		}
		res.json(category)
	})
}

exports.getCategory = (req, res) => {
	return res.json(req.category);
}

exports.getAllCategory = (req, res) => {
	Category.find().exec((err, category) => {
		if(err) {
			return res.status(400).json({
				error: "No categories found!"
			})
		}
		res.json(category);
	})
}

exports.updateCategory = (req, res) => {
	const category = req.category;
	category.name = req.body.name;

	category.save((err, updated) => {
		if (err) {
			return res.status(400).json({
				error: "failed to update category"
			})
		}

		res.json(updated);
	})
}

exports.deleteCategory = (req, res) => {
	const category = req.category;
	category.remove((err, category) => {
		if(err) {
			return res.status(400).json({
				error: "failes to delete the category"
			})
		}

		res.json({
			message: `successfully deleted ${category}`
		})
	})
}