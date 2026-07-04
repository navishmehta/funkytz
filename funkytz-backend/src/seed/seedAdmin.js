import 'dotenv/config';
import { connectDB } from '../config/db.js';
import Admin from '../models/Admin.js';
import mongoose from 'mongoose';

async function run() {
  await connectDB();

  const username = (process.env.ADMIN_USERNAME || 'admin').toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || 'changeme123';
  const email = process.env.ADMIN_EMAIL || '';

  const existing = await Admin.findOne({ username });
  if (existing) {
    console.log(`Admin "${username}" already exists. Skipping.`);
  } else {
    const passwordHash = await Admin.hashPassword(password);
    await Admin.create({ username, email, passwordHash, role: 'owner' });
    console.log(`Created admin account -> username: "${username}", password: "${password}"`);
    console.log('IMPORTANT: log in and change this password, or update ADMIN_PASSWORD before re-seeding.');
  }

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
