const express = require('express');
const router = express.Router();

const { isSignedIn, isAdmin, isAuthenticated } = require('../controllers/auth');
const { getUserById } = require('../controllers/user');
const { getProductById, createProduct, getProduct, photo, deleteProduct, updateProduct, getAllProducts } = require('../controllers/product');

router.param("userId", getUserById);
router.param("productId", getProductById);

router.post("/product/create/:userId", isSignedIn, isAuthenticated, isAdmin, createProduct);
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);

//update route
router.put('/product/:productId/:userId', isSignedIn, isAuthenticated, isAdmin, updateProduct);

//delete route
router.delete('/product/:productId/:userId', isSignedIn, isAuthenticated, isAdmin, deleteProduct);

//listing route
router.get('/products', getAllProducts);

module.exports = router;