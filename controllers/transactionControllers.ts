import { User, AccountDetails, Transaction } from "../models/Models";
import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const TransactionDetails = async (req: Request, res: Response) => {
  try {
    const accessToken = req.headers.accessToken as string | undefined;
    if (!accessToken) {
      return res.status(401).json({ error: "Access token is missing" });
    }

    const token = accessToken.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Token is missing" });
    }
    const decodedToken: JwtPayload = jwt.verify(
      token!,
      process.env.JWT_SECRET!
    ) as JwtPayload;
    const { email } = decodedToken;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "User does not exist" });
    }

    const userAccount = await AccountDetails.findOne({
      where: { userId: user.id },
    });

    if (!userAccount) {
      return res
        .status(404)
        .json({ error: "Cannot find an account associated with this user" });
    }
    
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
export { TransactionDetails };
