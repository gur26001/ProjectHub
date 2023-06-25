const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routers/user');
const projectRouter = require('./routers/project');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB Atlas
mongoose
	.connect(
		`mongodb+srv://admin:${process.env.DB_PASSWORD}@cluster0.8ew4mzh.mongodb.net/?retryWrites=true&w=majority`
	)
	.then(() => {
		console.log('Connected to MongoDB Atlas');
	})
	.catch((error) => {
		console.error('Error connecting to MongoDB Atlas:', error);
	});

// Routes
app.get('/', (req, res) => {
	res.send('Welcome to the blog!');
});

// Mount routers
app.use('/users', userRouter);
app.use('/projects', projectRouter);

// Start the server
app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
