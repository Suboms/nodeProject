import { User, AccountDetails } from "../model/Models";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import "dotenv/config";
import jwt, { JwtPayload } from "jsonwebtoken";

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
      return res.status(400).json({
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
      accountBalance: 200000000,
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
      expiresIn: 1800,
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "365d",
    });
    return res.status(200).json({ accessToken, refreshToken });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

const userProfile = async (req: Request, res: Response) => {
  try {
    const accessToken = req.headers.authorization as string | undefined;
    if (!accessToken) {
      return res.status(401).json({ error: "Access token is missing" });
    }

    const token = accessToken.split(" ")[1];

    if (!token || token === "null") {
      return res.status(401).json({ error: "Token is missing" });
    }
    let decodedToken: JwtPayload;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
    const { email } = decodedToken as unknown as { email: string };
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "User does not exist" });
    }
    const userAccount = await AccountDetails.findOne({
      where: { userId: user.id },
    });
    return res.status(200).json({ user, userAccount });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export { Signup, Login, userProfile };
