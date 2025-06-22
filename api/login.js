const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectDB = require('../../../../../../utils/db');
const User = require('../../models/User');

module.exports = async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }

    await connectDB();

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ token });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};
