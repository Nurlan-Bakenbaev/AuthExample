import express from "express";
import {
  signUp,
  signIn,
  signOut,
  sendverificationCode,
} from "../controllers/authController.js";

export const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/signin", signIn);
authRouter.post("/signout", signOut);
authRouter.patch("/sent-verification-code", sendverificationCode);
