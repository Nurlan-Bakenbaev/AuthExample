import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user:
      process.env.NODE_CODE_SENDING_EMAIL_ADDRESS || "iamsamurai1991@gmail.com",
    pass: process.env.NODE_CODE_SENDING_EMAIL_PASSWORD || "ufopfzeptrzpysxj",
  },
});
