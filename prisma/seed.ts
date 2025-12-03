import { PrismaClient, Role, SubmissionStatus } from '@prisma/client';
import { hash } from 'bcrypt';
import * as config from '../config/settings.development.json';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding the database');
  const password = await hash('changeme', 10);

  // -------------------------------
  // Seed Users
  // -------------------------------
  for (const account of config.defaultAccounts) {
    const role = (account.role as Role) || Role.USER;
    const username = account.username || null; // optional
    const score = account.score || 0; // default 0

    console.log(`  Creating user: ${account.email} (${username}) with role: ${role}`);
    // eslint-disable-next-line no-await-in-loop
    await prisma.user.upsert({
      where: { email: account.email },
      update: {
        username,
        score,
      },
      create: {
        email: account.email,
        password,
        role,
        username,
        score,
      },
    });
  }

  // -------------------------------
  // Seed Submissions (defaultLocations)
  // -------------------------------
  for (const loc of config.defaultLocations) {
    console.log(`  Adding submission: ${JSON.stringify(loc)}`);

    // eslint-disable-next-line no-await-in-loop
    await prisma.submission.create({
      data: {
        imageUrl: loc.imageUrl,
        caption: loc.caption,
        location: loc.location,
        submittedBy: loc.submittedBy,
        status: loc.status ? (loc.status as SubmissionStatus) : undefined,
        reportCount: loc.reportCount,
      },
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
