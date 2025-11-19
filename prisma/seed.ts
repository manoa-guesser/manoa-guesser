import { PrismaClient, Role, Condition } from '@prisma/client';
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
  // Seed Stuff
  // -------------------------------
  for (const data of config.defaultData) {
    const condition = (data.condition as Condition) || Condition.good;
    console.log(`  Adding stuff: ${JSON.stringify(data)}`);
    // eslint-disable-next-line no-await-in-loop
    await prisma.stuff.upsert({
      where: { id: config.defaultData.indexOf(data) + 1 },
      update: {},
      create: {
        name: data.name,
        quantity: data.quantity,
        owner: data.owner,
        condition,
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
