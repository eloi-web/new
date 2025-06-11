// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const app = express();

// Middleware to parse incoming JSON data
app.use(express.json());

const corsOptions = {
    origin: 'https://gba-ruby.vercel.app',  
    methods: ['GET', 'POST'],               
    allowedHeaders: ['Content-Type', 'Authorization'],  
};
app.use(cors(corsOptions));

app.post('/login', (req, res) => {
    module.exports = async (req, res) => {
         cors()(req, res, async () => {
        if (req.method === 'POST') {
            const { email, password } = req.body;
    
            try {
                const user = await User.findOne({ email });
                if (!user) {
                    return res.status(400).json({ error: 'Invalid email or password' });
                }
    
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return res.status(400).json({ error: 'Invalid email or password' });
                }
    
                // Create JWT Token
                const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
                res.status(200).json({ token });
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Server error' });
            }
        } 
        else {
            res.status(405).json({ error: 'Method Not Allowed' });
        }
    });
    };
    
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
