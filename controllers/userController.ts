import { User } from "../models/Models";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

const Signup = async (req: Request, res: Response) => {
  try {
    const { email, firstName, lastName, userName, password } = req.body;
    console.log("user data", req.body);
    
    if (!email || !firstName || !lastName || !userName || !password) {
      console.log("user data", req.body);
      return res.status(400).json({ message: "All fields are required" });
    }
    console.log("user data", req.body)

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
    return res.status(201).json(newUser);
  } catch (error: any) {
    console.error('Error during signup:', error);  
    return res.status(500).json({ message: error.message });
  }
};
export { Signup };