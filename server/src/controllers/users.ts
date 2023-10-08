import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../model/user";
import bcrypt from "bcrypt";
import * as crypto from "crypto";
import users from "../model/user";
import emailVerificationCode from "../model/EmailVerificationCode";
import { sendEmailVerificationCode } from "../util/EMailer";
import { email } from "envalid";
import jwt from "jsonwebtoken";
import env from "../util/validateEnv";

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
  try {
    // Use the userId from req to find the user
    const user = await users
      .findById(req.userId)
      .select("+email +username")
      .exec();

    if (!user) {
      // If the user is not found, return a 404 response or handle it accordingly
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user information
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const createVerificationCode = () => crypto.randomInt(100000, 999999);

interface otpRequestBody {
  email?: string;
}

export const sendVerificationCode: RequestHandler<
  unknown,
  unknown,
  otpRequestBody,
  unknown
> = async (req, res, next) => {
  try {
    const emailBody = req.body.email?.toString();
    if (
      await users
        .findOne({ email: emailBody })
        .collation({ locale: "en", strength: 2 })
        .exec()
    )
      throw createHttpError(
        409,
        "An account with this email already exists. Please login instead"
      );

    const verificationCode = createVerificationCode();

    await emailVerificationCode.create({
      email: emailBody,
      code: verificationCode,
    });

    const otpResponse = await sendEmailVerificationCode(
      emailBody,
      verificationCode
    );

    if (otpResponse.response.startsWith("250")) {
      res.send(200).json({
        success: true,
      });
    } else {
      console.log("Email sending failed.");
    }
  } catch (error) {
    next(error);
  }
};

interface signUpBody {
  username?: string;
  email?: string;
  password?: string;
  otp?: number;
}

const verifyOtpCode = async (email: string, code: number) => {
  const verificationCode = await emailVerificationCode
    .findOne({ email: email, code: code })
    .exec();
  if (!verificationCode)
    throw createHttpError(404, "Invalid verification code");
  await verificationCode.deleteOne();
};

export const signUp: RequestHandler<
  unknown,
  unknown,
  signUpBody,
  unknown
> = async (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const passwordRaw = req.body.password;
  const otp = req.body.otp;

  try {
    if (!username || !email || !passwordRaw || !otp) {
      throw createHttpError(400, "Parameters missing");
    }

    const existingUserName = await UserModel.findOne({
      username: username,
    }).exec();
    if (existingUserName) {
      throw createHttpError(
        409,
        "Username already taken. Please choose a different user name"
      );
    }

    const existingEmail = await UserModel.findOne({ email: email }).exec();
    if (existingEmail) {
      throw createHttpError(409, "E-Mail already used. Please login instead.");
    }

    await verifyOtpCode(email, otp);

    const passwordHashed = await bcrypt.hash(passwordRaw, 10);

    const newUser = await UserModel.create({
      username: username,
      email: email,
      password: passwordHashed,
    });

    const token = jwt.sign({ user: newUser }, env.JWT_SECRET, {
      expiresIn: "7d", // Set the token expiration time as needed
    });

    res.status(201).json({ user: newUser });
  } catch (error) {
    next(error);
  }
};

interface LoginBody {
  email?: string;
  password?: string;
}

export const login: RequestHandler<
  unknown,
  unknown,
  LoginBody,
  unknown
> = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    if (!email || !password) {
      throw createHttpError(400, "Parameters missing");
    }
    const user = await UserModel.findOne({ email: email })
      .select("+username +email +password")
      .exec();

    if (!user) {
      throw createHttpError(401, "invalid creadentials");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw createHttpError(401, "invalid creadentials");
    }

    const token = jwt.sign({ userId: user._id }, env.JWT_SECRET, {
      expiresIn: "7d", // Set the token expiration time as needed
    });

    res.status(201).json({ message: "User Logged in Successfully !", token });
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
    } else {
      // we use send status here because we dont want to send json body here
      res.sendStatus(200);
    }
  });
};
