import bcrypt from "bcryptjs";
import httpStatus from "http-status-codes";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "./../modules/user/user.model";

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExists = await User.findOne({
      email: envVars.SUPER_ADMIN_EMAIL,
    });
    if (isSuperAdminExists) {
      console.log("Already Super admin exits");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      envVars.SUPER_ADMIN_PASSWORD,
      envVars.BCRYPT_SALT_ROUND,
    );

    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVars.SUPER_ADMIN_EMAIL,
    };

    const payload: IUser = {
      name: "Super Admin",
      email: envVars.SUPER_ADMIN_EMAIL,
      role: Role.SUPER_ADMIN,
      password: hashedPassword,
      auths: [authProvider],
      isVerified: true,
    };

    const superadmin = await User.create(payload);
    console.log("Super admin created successfully! \n");
    console.log(superadmin);
  } catch (error) {
    console.log(error);
    throw new AppError(httpStatus.BAD_REQUEST, "Something went wrong");
  }
};
