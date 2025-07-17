// pages/api/auth/login.js (DEBUGGING VERSION)
import connectDb from '@/utils/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  console.log('\n--- LOGIN ATTEMPT ---');
  if (req.method !== 'POST') {
    console.log('Error: Incorrect method used:', req.method);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;
    console.log(`1. Received login request for email: ${email}`);

    if (!email || !password) {
      console.log('Error: Email or password missing from request.');
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    console.log('2. Connecting to database...');
    await connectDb();
    console.log('3. Database connection successful.');

    console.log(`4. Searching for user with email: ${email}...`);
    const user = await User.findOne({ email });

    if (!user) {
      console.log('5. User not found in database.');
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    console.log('5. User found:', user._id);
    console.log('6. Comparing submitted password with stored hash...');

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`7. Password comparison result (isMatch): ${isMatch}`);

    if (!isMatch) {
      console.log('8. Passwords DO NOT match. Sending 401 Unauthorized.');
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    console.log('8. Passwords match. Creating JWT...');
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    console.log('9. Sending success response with token.');
    res.status(200).json({ token, userId: user._id });

  } catch (error) {
    console.error('--- A CATASTROPHIC ERROR OCCURRED ---');
    console.error(error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
}