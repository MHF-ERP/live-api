// prisma/seeds/notificationSettings.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export async function seedCustomer(prisma: PrismaClient) {
  const role = await prisma.role.findUnique({
    where: { key: 'customer' },
  });
  const count = await prisma.user.count({
    where: {
      roleId: role.id, // Assuming roleId 2 is for customers
    },
  });
  if (count > 0) {
    return;
  }
  for (let i = 1; i <= 1; i += 1) {
    const data = {
      name: `customer${i}`,
      email: `customer${i}@user.com`,
      phone: `+966 0509999${i}`,
      roleId: role.id,
      verified: true,
      password: bcrypt.hashSync(process.env.PASSWORD, +process.env.HASH_SALT),
    };
    await prisma.user.upsert({
      where: {
        id: i,
      },
      create: {
        ...data,
      },
      update: data,
    });
  }
  // eslint-disable-next-line no-console
  console.log('✅ Customer seeded');
}
