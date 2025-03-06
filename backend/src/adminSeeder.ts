import User from "./database/models/userModel";
import dotenv from "dotenv";
import { Role } from "./types";
import bcrypt from "bcryptjs";

dotenv.config();

export const adminSeeder = async () => {
  // Start the transaction
  const transaction = await User.sequelize?.transaction();

  try {
    await User.findOrCreate({
      where: { email: process.env.ADMIN_EMAIL },
      defaults: {
        email: process.env.ADMIN_EMAIL,
        password: await bcrypt.hash(process.env.ADMIN_PASSWORD as string, 10),
        role: Role.Admin,
        userName: "pasalhamro",
      },
      transaction,
    });

    await transaction?.commit();
  } catch (error) {
    await transaction?.rollback();
    throw error;
  }
};
