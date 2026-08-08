import { connectDB, disconnectDB } from '../config/db.js';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { isStrongPassword, validateEmail, normalizeEmail, validateName } from '../utils/validators.js';

function usage() {
  console.log(`
Usage:
  node server/tools/create-admin.js --email <email> --password '<password>' [--name '<name>']
  node server/tools/create-admin.js --demote <email>

Examples:
  node server/tools/create-admin.js --email myadmin@mydomain.com --password 'My$trong!Pass123' --name 'Store Owner'
  node server/tools/create-admin.js --demote oldadmin@example.com

What it does:
  - With --email: creates the account as admin (or promotes it if it already exists).
  - With --demote: removes admin access from an account (sets role to user).
  - It never touches other accounts.
`);
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--email') args.email = argv[i + 1];
    if (argv[i] === '--password') args.password = argv[i + 1];
    if (argv[i] === '--name') args.name = argv[i + 1];
    if (argv[i] === '--demote') args.demote = argv[i + 1];
    if (argv[i] === '--help' || argv[i] === '-h') args.help = true;
  }
  return args;
}

async function main() {
  const { email, password, name, demote, help } = parseArgs(process.argv.slice(2));

  if (help) {
    usage();
    process.exit(0);
  }

  if (demote) {
    if (!validateEmail(demote)) {
      console.error('ERROR: Invalid email address.');
      process.exit(1);
    }
    await connectDB(env.MONGO_URI);
    const target = await User.findOne({ email: normalizeEmail(demote) });
    if (!target) {
      console.error(`No account found for ${normalizeEmail(demote)}.`);
      await disconnectDB();
      process.exit(1);
    }
    if (target.role !== 'admin') {
      console.log(`${normalizeEmail(demote)} is not an admin. Nothing to do.`);
      await disconnectDB();
      process.exit(0);
    }
    target.role = 'user';
    target.refreshTokenHash = '';
    await target.save();
    console.log(`\nDemoted ${normalizeEmail(demote)} -> role=user (admin access removed, session invalidated).\n`);
    await disconnectDB();
    process.exit(0);
  }

  if (!email || !password) {
    usage();
    process.exit(1);
  }
  if (!validateEmail(email)) {
    console.error('ERROR: Invalid email address.');
    process.exit(1);
  }
  if (!isStrongPassword(password)) {
    console.error('ERROR: Password must be at least 8 characters with upper, lower, number, and special characters.');
    process.exit(1);
  }
  if (name && !validateName(name)) {
    console.error('ERROR: Name must be 2-60 characters.');
    process.exit(1);
  }

  await connectDB(env.MONGO_URI);

  const normalizedEmail = normalizeEmail(email);
  const normalizedName = name ? name.trim() : 'Admin';

  let user = await User.findOne({ email: normalizedEmail });
  if (user) {
    user.role = 'admin';
    user.isActive = true;
    user.name = normalizedName;
    await user.setPassword(password);
    await user.save();
    console.log(`\nUpdated EXISTING account (${normalizedEmail}) -> role=admin, password set.\n`);
  } else {
    user = new User({ name: normalizedName, email: normalizedEmail, role: 'admin' });
    await user.setPassword(password);
    await user.save();
    console.log(`\nCreated NEW admin account: ${normalizedEmail}\n`);
  }

  console.log('IMPORTANT:');
  console.log('1. Sign in with this email + password at the storefront.');
  console.log('2. Use it instead of the old default admin@shopeasy.com.');
  console.log('3. Delete or demote any rogue admin accounts (see server/tools/list-admins.js).');
  console.log('4. Change the ADMIN_EMAIL / ADMIN_PASSWORD values in your hosting settings too.');
}

main()
  .catch(err => {
    console.error('Failed:', err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDB();
  });
