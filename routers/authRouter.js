import express from "express";
import {
  signUp,
  signIn,
  signOut,
  sendverificationCode,
  verifyVerificationCode,
} from "../controllers/authController.js";
import { idientifier } from "../middlewares/identification.js";

export const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/signin", signIn);
authRouter.post("/signout", idientifier, signOut);
authRouter.patch("/sent-verification-code", idientifier, sendverificationCode);
authRouter.patch(
  "/verify-verification-code",
  idientifier,
  verifyVerificationCode
);
