const express = require('express');
const User = require('../models/user');

const router = express.Router();
const dotenv = require('dotenv');
const {
	getUserByUsername,
	createUser,
	updateUser,
	logginUser,
} = require('../controllers/user');
dotenv.config();

//MIDDLEWARES
//check user if logged in

// GET all users
router.get('/', (req, res) => {
	User.find()
		.then((users) => {
			res.json(users);
		})
		.catch((error) => {
			console.error('Error retrieving users:', error);
			res.status(500).json({ error: 'Error retrieving users' });
		});
});

router.get('/:username', getUserByUsername);

// SIGNUP
router.post('/signup', createUser);

// router.post('/token',);
router.post('/login', logginUser);
 

// update user infor
router.put('/:username', updateUser);

module.exports = router;
