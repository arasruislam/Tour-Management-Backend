import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
  const { email, ...rest } = payload;

  const isUserExits = await User.findOne({ email });
  if (isUserExits) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exits");
  }

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    auth: [authProvider],
    ...rest,
  });

  return user;
};

const getAllUsers = async () => {
  const users = await User.find({});
  const totalUser = await User.countDocuments();

  return {
    data: users,
    meta: {
      total: totalUser,
    },
  };
};

export const UserServices = {
  createUser,
  getAllUsers,
};
