const express = require('express');
const User = require('../models/user');

const router = express.Router();

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

// POST a new user
router.post('/', (req, res) => {
	const { username, email, password } = req.body;
	const newUser = new User({ username, email, password });
	newUser
		.save()
		.then((user) => {
			res.json(user);
		})
		.catch((error) => {
			console.error('Error creating user:', error);
			res.status(500).json({ error: 'Error creating user' });
		});
});

module.exports = router;
