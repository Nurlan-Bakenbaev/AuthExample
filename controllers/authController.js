import {
  acceptedCodeValidation,
  signInValidation,
  signUpValidation,
} from "../middlewares/validator.js";
import { doHash, doHashValidate, hmacProcess } from "../utils/hashing.js";
import User from "../models/usersModel.js";
import jwt from "jsonwebtoken";
import { transporter } from "../middlewares/sendMail.js";

///SIGH-UP///
export const signUp = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { error, value } = signUpValidation.validate({ email, password });
    if (error) {
      res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(200)
        .json({ success: true, message: "User already exists!" });
    }
    const hashedPassword = await doHash(password, 12);
    const newUser = new User({ email, password: hashedPassword });
    const result = await newUser.save();
    result.password = undefined;
    res.status(201).json({
      success: true,
      message: "A new account has been created!",
      user: result,
    });
  } catch (error) {
    res.status(404).json({ message: "An error has occurred", error: error });
  }
};

/// SIGH-IN ///
export const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate incoming data
    const { error, value } = signInValidation.validate({ email, password }); // Assuming validation expects an object
    if (error) {
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }

    // Find user by email, including password field
    const existingUser = await User.findOne({ email }).select("+password");
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Validate password
    const isMatch = await doHashValidate(password, existingUser.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Create a token
    const token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
        verified: existingUser.verified,
      },
      process.env.TOKEN_SECRET,
      { expiresIn: "8h" }
    );

    // Set token in cookie and respond
    return res
      .cookie("Authorization", "Bearer " + token, {
        expires: new Date(Date.now() + 8 * 3600000),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json({ success: true, token: token, message: "Logged in successfully" });
  } catch (error) {
    console.error("SignIn Error: ", error);
    return res.status(500).json({
      success: false,
      message: "An error has occurred while signing in",
      error: error.message,
    });
  }
};

export const signOut = (req, res) => {
  res.clearCookie("Authorization");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const sendverificationCode = async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (existingUser.verified) {
      return res
        .status(400)
        .json({ success: false, message: "User already verified" });
    }
    const codeValue = Math.floor(Math.random() * 1000000).toString();
    let info = await transporter.sendMail({
      from: "BAY-SHOP",
      to: email,
      subject: "Verification Code",
      html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #4CAF50;">Hello,</h2>
        <p>Thank you for choosing our services. Your verification code is:</p>
        <div style="text-align: center; margin: 20px 0;">
          <h1 style="color: #333; border: 1px solid red; padding: 10px; display: inline-block;">${codeValue}</h1>
        </div>
        <p>Please use this code to verify your account.</p>
        <p>If you did not request this, please ignore this email.</p>
        <br/>
        <p>Best regards,</p>
        <p><strong>The BAY-SHOP Team</strong></p>
        <hr/>
        <p style="font-size: 12px; color: #777;">This is an automated email. Please do not reply to this email directly.</p>
      </div>`,
    });
    if (info.accepted[0] === existingUser.email) {
      const hashedCodeValue = hmacProcess(
        codeValue,
        process.env.HMAC_VERIFICATION_CODE_SECRET
      );
      existingUser.verificationCode = hashedCodeValue;
      existingUser.verificationCodeValidation = Date.now();
      await existingUser.save();
      return res
        .status(200)
        .json({ success: true, message: "Validation code has been send!" });
    }
    res
      .status(400)
      .json({ success: false, message: "Validation code has been send!" });
  } catch (error) {
    console.error("Verification Code Send Error: ", error);
    return res.status(500).json({
      success: false,
      message: "An error has occurred while sending verification code",
      error: error.message,
    });
  }
};

export const verifyVerificationCode = async (req, res) => {
  const { email, providedCode } = req.body;
  try {
    const { error, value } = acceptedCodeValidation.validate({
      email,
      providedCode,
    });
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    const codeValue = providedCode.toString();
    const existingUser = await User.findOne({ email: email }).select(
      "+verificationCode +verificationCodeValidation"
    );
    if (!existingUser) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }
    if (existingUser.verified) {
      return res
        .status(400)
        .json({ success: false, message: "User already verified" });
    }
    if (
      !existingUser.verificationCode ||
      !existingUser.verificationCodeValidation
    ) {
      return res.status(400).json({ success: false, message: "Error occured" });
    }
    if (Date.now() - existingUser.verificationCodeValidation > 5 * 60 * 10000) {
      res.status(400).json({ success: false, message: "Code is Expired" });
    }
    const hashedProvidedCode = hmacProcess(
      codeValue,
      process.env.HMAC_VERIFICATION_CODE_SECRET
    );
    if (hashedProvidedCode === existingUser.verificationCode) {
      existingUser.verified = true;
      existingUser.verificationCode = undefined;
      existingUser.verificationCodeValidation = undefined;
      await existingUser.save();
      return res
        .status(200)
        .json({ success: true, message: "Your Accound is verified" });
    }
    return res.status(404).json({ true: false, message: "Unexpected Occured" });
  } catch (error) {
    console.log(error);
  }
};
