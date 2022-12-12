import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "test@crf-formation.fr";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("bonjour1", 10);

  const user = await prisma.user.create({
    data: {
      email,
      firstName: "Jon",
      lastName: "Doe",
      state: "ENABLED",
      role: "SUPER_ADMIN",
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await prisma.userPasswordToken.create({
    data: {
      token: "1234",
      userId: user.id,
      tokenExpirationDate: new Date(Date.now())
    }
  })

  // nothing to seed yet
  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
