require('dotenv').config();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;
// const REF_SECRET = process.env.JWT_REFRESH_SECRET;

const SALT = bcrypt.genSaltSync(10);

// const Refresh_Tokens = []; //reddis db goes here,if in production

async function getUserByUsername(req, res) {
	const username = req.params.username;
	User.findOne({ username })
		.then((user) => {
			if (user) {
				res.json({
					name: user.name,
					username: username,
					blogs: user.blogs,
				});
			} else {
				res.status(404).json({ error: 'User not found' });
			}
		})
		.catch((error) => {
			console.error('Error retrieving user:', error);
			res.status(500).json({ error: 'Error retrieving user' });
		});
}

async function createUser(req, res) {
	const { name, username, email, password } = req.body;
	// encrypting the password
	const hashedPassword = bcrypt.hashSync(password, SALT);
	// Checking if user already exists;(else will throw err)
	const userName = await User.findOne({
		username: username,
		email: email,
	});
	if (userName == null) {
		const newUser = new User({
			name,
			username,
			email,
			password: hashedPassword,
		});
		newUser
			.save()
			.then((user) => {
				res.json(user);
			})
			.catch((error) => {
				console.error('Error creating user:', error);
				res.status(500).json({ error: 'Error creating user' });
			});
	} else {
		console.log('user already exists');
		res.status(200).json({ message: 'user already exists' });
	}
}

async function updateUser(req, res) {
	const username = req.params.username;
	const { email, password } = req.body;
	User.findOneAndUpdate({ username }, { email, password }, { new: true })
		.then((user) => {
			if (user) {
				res.json(user);
			} else {
				res.status(404).json({ error: 'User not found' });
			}
		})
		.catch((error) => {
			console.error('Error updating user:', error);
			res.status(500).json({ error: 'Error updating user' });
		});
}

function generateAccessToken(usr) {
	return jwt.sign(usr, SECRET, { expiresIn: '3600s' }); //after 1 hour autologout,relogin req.
}

// async function refreshTokenCheck(req, res) {
// 	//basically to reassign token,after logout automatically
// 	const { refTokenHub } = req.body;
// 	if (refTokenHub == null) return res.status(401); //not sent/loggedout(manually)
// 	if (!Refresh_Tokens.includes(refTokenHub)) {
// 		//loggedout
// 		res.status(403);
// 	}
// 	jwt.verify(refTokenHub, REF_SECRET, (err, user) => {
// 		if (err) return res.status(403);
// 		const accessTokenHub = generateAccessToken({ name: user.name });
// 		res.json(accessTokenHub);
// 	});
// }

async function logginUser(req, res) {
	const { username, password } = req.body;
	// checks user if exists ,
	const userExists = await User.findOne({ username });

	if (userExists) {
		const hashedPassword = userExists.password;
		const isPasswordMatched = bcrypt.compareSync(password, hashedPassword);
		if (isPasswordMatched) {
			// assigning jwt token
			const usr = { name: username };
			const accessTokenHub = generateAccessToken(usr); //normal token expires after _s.
			// const refTokenHub = jwt.sign(usr, REF_SECRET);
			// Refresh_Tokens.push(refTokenHub);
			res.json({
				msg: 'Congratulation!You are logged In',
				accessTokenHub,
				// refTokenHub,
			});
		} else {
			res.json({
				msg: 'PASSWORD INCORRECT!',
			});
		}
	} else {
		res.status(404).json({ error: "User doesn't Exist" });
	}

	// if yes then assigns jwt
}

async function logOut(req, res) {}

module.exports = {
	getUserByUsername,
	createUser,
	updateUser,
	logginUser,
	logOut,
};
