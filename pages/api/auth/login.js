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

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.status(200).json({ token });
}