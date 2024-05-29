import { User, AccountDetails } from "../models/Models";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { log } from "console";

const Signup = async (req: Request, res: Response) => {
  const minaccountNum = 5e9;
  const maxaccountNum = 6e9 - 1;

  try {
    const { email, firstName, lastName, userName, password } = req.body;

    const missingFields = [];

    if (!email) missingFields.push("email");
    if (!firstName) missingFields.push("firstName");
    if (!lastName) missingFields.push("lastName");
    if (!userName) missingFields.push("userName");
    if (!password) missingFields.push("password");

    if (missingFields.length > 0) {
      return res
        .status(400)
        .json({
          message: "The following fields are required",
          missingFields: missingFields,
        });
    }


    const isUser = await User.findOne({ where: { email } });
    if (isUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      email,
      firstName,
      lastName,
      userName,
      password: hashedPassword,
    });
    const newAccount = await AccountDetails.create({
      userId: newUser.id,
      accountNum: BigInt(
        Math.floor(
          minaccountNum + Math.random() * (maxaccountNum - minaccountNum + 1)
        )
      ).toString(),
      accountBalance: 0,
    });
    return res.status(201).json({ user: newUser, account: newAccount });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const payload = {
      id: user.id,
      email: user.email,
      userName: user.userName,
    };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "10h",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "365d",
    });
    return res.status(200).json({ accessToken, refreshToken });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export { Signup, Login };
