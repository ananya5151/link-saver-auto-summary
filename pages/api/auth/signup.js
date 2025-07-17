import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../../models/User';
import dbConnect from '../../../utils/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await dbConnect();

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ message: 'Invalid input' });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(422).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = new User({
    email,
    password: hashedPassword,
  });

  const user = await newUser.save();

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.status(201).json({ token });
}