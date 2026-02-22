import { NextFunction, Request, Response, Router } from "express";
import httpStatus from "http-status-codes";
import jwt from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserControllers } from "./user.controller";
import { createUserZodSchema } from "./user.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserControllers.createUser,
);
router.get(
  "/all-users",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        throw new AppError(httpStatus.UNAUTHORIZED, "User Unauthorized");
      }

      const verifiedToken = jwt.verify(accessToken, "secret");
      console.log(verifiedToken);

      next();
    } catch (error) {
      next(error);
    }
  },
  UserControllers.getAllUsers,
);

export const UserRoutes = router;
