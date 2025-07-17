// pages/api/auth/signup.js
import connectDb from '../../../utils/db';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDb();
    const { email, password } = req.body;

    if (!email || !password || password.trim().length < 6) {
      return res.status(400).json({ message: 'Invalid input - password should be at least 6 characters long.' });
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(422).json({ message: 'User with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully!' });

  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
}