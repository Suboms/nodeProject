import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User, Statement } from "../model/Models";

const StatementDetail = async (req: Request, res: Response) => {
  try {
    const accessToken = req.headers.authorization;
    if (!accessToken) {
      return res.status(401).json({ error: "Access token is missing" });
    }

    const token = accessToken.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Token is missing" });
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;
    const { email } = decodedToken;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "User does not exist" });
    }

    const userStatement = await Statement.findAll({
      where: { accountId: user.id },
    });

    return res.status(200).json({ message: userStatement });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export { StatementDetail };
