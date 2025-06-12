// server.js
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const app = express();

// Middleware to parse incoming JSON data
app.use(express.json());

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    // Hardcoded email and password for login (you can change this)
    const hardcodedEmail = 'reloimiguel@gmail.com';
    const hardcodedPassword = 'miguel..';

    // Dummy user validation: check if email and password match the hardcoded ones
    if (email === hardcodedEmail && password === hardcodedPassword) {
        // Create a JWT token
        const token = jwt.sign({ user: email }, 'miguel..', { expiresIn: '1h' });

        // Respond with the token
        return res.json({ token });
    }

    // If the credentials don't match, send an error
    res.status(401).json({ message: 'Invalid credentials' });
});

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://miguel:miguel..@cluster0.g1iwcy3.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB', err));

app.use(authRoutes);

// A simple route to test the server
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Importing the upload route
const uploadRoute = require('./routes/uploadRoute');

// Use the upload route for any upload requests
app.use(uploadRoute);

// Post model for MongoDB
const Post = require('./models/Post');

// Create a new post
app.post('/posts', async (req, res) => {
    const { title, body, imageUrl } = req.body;

    try {
        const post = new Post({ title, body, imageUrl });
        await post.save();
        res.status(201).send(post);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get all posts
app.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).send(posts);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
