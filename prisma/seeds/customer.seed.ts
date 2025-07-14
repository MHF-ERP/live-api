// prisma/seeds/notificationSettings.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export async function seedCustomer(prisma: PrismaClient) {
  for (let i = 21; i <= 40; i += 1) {
    const data = {
      id: i,
      name: `user${i}`,
      email: `user${i}@user.com`,
      phone: `+966 0509999${i}`,
      roleId: 2,
      verified: true,
      password: bcrypt.hashSync(process.env.PASSWORD, +process.env.HASH_SALT),
    };
    await prisma.user.upsert({
      where: {
        id: i,
      },
      create: data,
      update: data,
    });
  }
  // eslint-disable-next-line no-console
  console.log('✅ Customer seeded');
}
