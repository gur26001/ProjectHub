const express = require('express');
const Project = require('../models/project');
const User = require('../models/user'); //needed for authenticate
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const router = express.Router();

// GET all projects
router.get('/', (req, res) => {
	Project.find()
		.then((projects) => {
			res.json(projects);
		})
		.catch((error) => {
			console.error('Error retrieving projects:', error);
			res.status(500).json({ error: 'Error retrieving projects' });
		});
});

function authenticateToken(req, res, next) {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
	console.log(token);
	if (token == null) return res.sendStatus(401);

	jwt.verify(token, secret, (err, user) => {
		console.log(err);
		if (err) return res.sendStatus(403);
		// req.user = user;
		next();
	});
}

// GET a specific project by ID
router.get('/:id', (req, res) => {
	const projectId = req.params.id;
	Project.findById(projectId)
		.then((project) => {
			if (project) {
				res.json(project);
			} else {
				res.status(404).json({ error: 'Project not found' });
			}
		})
		.catch((error) => {
			console.error('Error retrieving project:', error);
			res.status(500).json({ error: 'Error retrieving project' });
		});
});

// POST a new project
router.post('/', authenticateToken, (req, res) => {
	const { title, description, image, createdBy } = req.body;

	User.findOne({ username: createdBy })
		.then((user) => {
			if (!user) {
				return res.status(404).json({ error: 'User not found' });
			}

			const newProject = new Project({
				title,
				description,
				image,
				createdBy,
			});
			newProject
				.save()
				.then((project) => {
					user.blogs.push(project._id); //now udpdate the database the user has created that post
					user.save()
						.then(() => {
							res.json(project);
						})
						.catch((error) => {
							console.error('Error updating user:', error);
							res.status(500).json({
								error: 'Error updating user',
							});
						});
				})
				.catch((error) => {
					console.error('Error creating project:', error);
					res.status(500).json({ error: 'Error creating project' });
				});
		})
		.catch((error) => {
			console.error('Error finding user:', error);
			res.status(500).json({ error: 'Error finding user' });
		});
});

// PUT/update a project by ID
router.put('/:id', authenticateToken, (req, res) => {
	const projectId = req.params.id;
	const { title, description, image } = req.body;
	Project.findByIdAndUpdate(
		projectId,
		{ title, description, image },
		{ new: true }
	)
		.then((project) => {
			if (project) {
				res.json(project);
			} else {
				res.status(404).json({ error: 'Project not found' });
			}
		})
		.catch((error) => {
			console.error('Error updating project:', error);
			res.status(500).json({ error: 'Error updating project' });
		});
});

// DELETE a project by ID
router.delete('/:id', authenticateToken, (req, res) => {
	const projectId = req.params.id;
	Project.findByIdAndDelete(projectId)
		.then((project) => {
			if (project) {
				res.json(project);
			} else {
				res.status(404).json({ error: 'Project not found' });
			}
		})
		.catch((error) => {
			console.error('Error deleting project:', error);
			res.status(500).json({ error: 'Error deleting project' });
		});
});

module.exports = router;
