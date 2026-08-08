import { connectDB, disconnectDB } from '../config/db.js';
import { env } from '../config/env.js';
import { User } from '../models/User.js';

async function main() {
  await connectDB(env.MONGO_URI);

  const admins = await User.find({ role: 'admin' }).sort({ createdAt: 1 });
  const totalUsers = await User.countDocuments();
  const totalAdmins = admins.length;

  console.log(`\nTotal users in database: ${totalUsers}`);
  console.log(`Total admin accounts:   ${totalAdmins}\n`);

  if (admins.length === 0) {
    console.log('No admin accounts found. A new one is seeded on next boot from ADMIN_EMAIL/ADMIN_PASSWORD in .env.');
    return;
  }

  admins.forEach((admin, index) => {
    console.log(`[${index + 1}] Admin account`);
    console.log(`    email:     ${admin.email || '(none)'}`);
    console.log(`    name:      ${admin.name}`);
    console.log(`    active:    ${admin.isActive}`);
    console.log(`    passwordless: ${admin.passwordless}`);
    console.log(`    created:   ${admin.createdAt?.toISOString()}`);
    console.log(`    updated:   ${admin.updatedAt?.toISOString()}`);
    console.log('');
  });

  console.log('Review this list. Any account you do not recognise may have been created by an attacker.');
  console.log('To remove a rogue admin you must edit MongoDB directly (Atlas UI or mongosh),');
  console.log('or restore from a backup taken before the compromise.');
}

main()
  .catch(err => {
    console.error('Failed to list admins:', err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDB();
  });
