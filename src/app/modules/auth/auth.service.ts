import bcrypt from "bcryptjs";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import {
  createUserTokens,
  getNewAccessTokenWithRefreshToken,
} from "../../utils/userTokens";
import { IUser } from "../user/user.interface";
import { User } from "./../user/user.model";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist");
  }
  const isPasswordMatched = await bcrypt.compare(
    password as string,
    isUserExist.password as string,
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password not match.");
  }

  const userTokens = createUserTokens(isUserExist);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: pass, ...rest } = isUserExist.toObject();

  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: rest,
  };
};

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await getNewAccessTokenWithRefreshToken(refreshToken);

  return {
    accessToken: newAccessToken,
  };
};

export const authServices = {
  credentialsLogin,
  getNewAccessToken,
};
