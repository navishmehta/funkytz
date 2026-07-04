import Admin from '../models/Admin.js';
import { signToken } from '../middleware/auth.js';

export async function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const admin = await Admin.findOne({ username: username.toLowerCase().trim() });
  if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

  const valid = await admin.comparePassword(password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  const token = signToken(admin);
  res.json({
    token,
    admin: { id: admin._id, username: admin.username, role: admin.role },
  });
}

export async function me(req, res) {
  res.json({ admin: req.admin });
}
