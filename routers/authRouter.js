import express from "express";
import {
  signUp,
  signIn,
  signOut,
  sendverificationCode,
  verifyVerificationCode,
  changePassword,
} from "../controllers/authController.js";
import { identifier } from "../middlewares/identification.js";

export const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/signin", signIn);
authRouter.post("/signout", identifier, signOut);
authRouter.patch("/sent-verification-code", identifier, sendverificationCode);
authRouter.patch(
  "/verify-verification-code",
  identifier,
  verifyVerificationCode
);
authRouter.patch("/change-password", identifier, changePassword);
