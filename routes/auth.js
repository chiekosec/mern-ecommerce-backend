var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
const { signout,signup,signin,isSignedIn } = require('../controllers/auth');


router.post('/signup', [
	check('email', 'Valid email address  required :O').isEmail(),
	check('password', 'Password should be atleast 8 characters long :O').isLength({ min: 8 }),
	check('name', 'name should be atleast 3 characters long :O').isLength({min: 3})
], signup)

router.post('/signin', [
	check('email', 'Valid email address  required :o').isEmail(),
	check('password', 'Password should be atleast 8 characters long :O').isLength({ min: 8 }),
], signin)

router.get('/signout', signout)

router.get('/protected', isSignedIn, (req, res) => {
	res.json({
		message: req.auth
	})
})

module.exports = router;
