import { DataSource } from "typeorm";
import { User } from "../models/models";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();
type AdminSeed = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export const seedAdmins = async (dataSource: DataSource) => {
  const raw = process.env.ADMIN_USERS;
  const currentDate = new Date();

  if (!raw) {
    console.warn(" No ADMIN_USERS found");
    return;
  }

  const admins: AdminSeed[] = JSON.parse(raw);
  const repo = dataSource.getRepository(User);

  for (const admin of admins) {
    const exists = await repo.findOne({
      where: { email: admin.email },
    });

    if (exists) {
      continue;
    }

    const hashed = await bcrypt.hash(admin.password, 10);

    await repo.save(
      repo.create({
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        createdAt: currentDate,
        userType: "admin",
        isVerified: true,
        password: hashed,
        
      })
    );

  }
};
