const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});


app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const newUser = new User({ name, email, password });
        await newUser.save();
        res.json({ message: 'User created!' });
    } catch (error) {
        res.status(500).json({ error: 'Error creating user' });
    }
});
// Read All
app.get('/users', async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from MongoDB
        res.json(users);  // Send user data as JSON
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
});
// Read by ID
app.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id); // Fetch user by ID
        if (!user) {
            console.log('User not found'); // Log if user is not found
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error); // Log error details
        res.status(500).json({ error: 'Error fetching user' });
    }
});

// (UPDATE)
app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email , pass} = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id, 
            { name, email , pass}, 
            { new: true, runValidators: true } // Return updated user and run schema validators
        );
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Error updating user' });
    }
});

// (DELETE)
app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting user' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
