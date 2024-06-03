import { User, AccountDetails, Transaction, Statement } from "../models/Models";
import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import Decimal from "decimal.js";

const TransactionDetails = async (
  req: Request,
  res: Response
): Promise<Response> => {
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

    const {
      transactionAmount,
      transactionDestination,
      destinationBank,
      description,
    } = req.body;

    const date = new Date();
    const parsedTransactionAmount = new Decimal(transactionAmount);
    const destinationAccount = parseInt(transactionDestination);

    if (
      isNaN(destinationAccount) ||
      destinationAccount.toString().length !== 10
    ) {
      return res.status(400).json({ error: "Invalid account number" });
    }

    if (
      parsedTransactionAmount.isNaN() ||
      parsedTransactionAmount.lessThanOrEqualTo(99.99)
    ) {
      return res.status(400).json({ error: "Invalid transaction amount" });
    }

    const userAccount = await AccountDetails.findOne({
      where: { userId: user.id },
    });

    if (!userAccount) {
      return res
        .status(404)
        .json({ error: "Cannot find an account associated with this user" });
    }

    const destinationAccountExists = await AccountDetails.findOne({
      where: { accountNum: destinationAccount },
    });

    if (!destinationAccountExists) {
      return res
        .status(404)
        .json({ error: "Destination account does not exist" });
    }

    if (userAccount.dataValues.accountNum === destinationAccount) {
      return res
        .status(403)
        .json({ error: "You can't transfer to your own account" });
    }

    const initialBal = new Decimal(userAccount.dataValues.accountBalance);
    const newBal = initialBal.minus(parsedTransactionAmount);

    if (newBal.lessThan(500)) {
      return res.status(403).json({ error: "Insufficient funds" });
    }

    const transactionTypeSender = "debit";
    const transactionTypeReceiver = "credit";

    // Create transaction for sender (debit)
    const newTransactionSender = await Transaction.create({
      accountId: userAccount.dataValues.id,
      transactionAmount: parsedTransactionAmount.toFixed(2),
      transactionDestination: destinationAccount,
      destinationBank,
      description,
      transactionDate: date.toISOString(),
      transactionType: transactionTypeSender,
    });

    // Update sender's account balance
    await AccountDetails.update(
      { accountBalance: newBal.toFixed(2) },
      { where: { accountNum: userAccount.dataValues.accountNum } }
    );

    // Create transaction for receiver (credit)
    const newTransactionReceiver = await Transaction.create({
      accountId: destinationAccountExists.dataValues.id,
      transactionAmount: parsedTransactionAmount.toFixed(2),
      transactionDestination: userAccount.dataValues.accountNum,
      destinationBank,
      description,
      transactionDate: date.toISOString(),
      transactionType: transactionTypeReceiver,
    });

    // Update receiver's account balance
    const newDestinationBal = new Decimal(destinationAccountExists.dataValues.accountBalance)
      .plus(parsedTransactionAmount)
      .toFixed(2);

    await AccountDetails.update(
      { accountBalance: newDestinationBal },
      { where: { accountNum: destinationAccount } }
    );

    // Save statement for sender
    const statementDataSender = {
      transactionAmount: parsedTransactionAmount.toFixed(2),
      transactionDestination: destinationAccount,
      destinationBank,
      description,
      transactionDate: date.toISOString(),
      transactionType: transactionTypeSender,
    };

    await Statement.create({
      accountId: user.id,
      statementData: statementDataSender,
    });

    // Save statement for receiver
    const statementDataReceiver = {
      transactionAmount: parsedTransactionAmount.toFixed(2),
      transactionOrigin: userAccount.dataValues.accountNum,
      destinationBank,
      description,
      transactionDate: date.toISOString(),
      transactionType: transactionTypeReceiver,
    };

    await Statement.create({
      accountId: destinationAccountExists.dataValues.userId,
      statementData: statementDataReceiver,
    });

    return res.status(200).json({
      message: "Transaction Successful",
      userAccount: {
        ...userAccount.dataValues,
        accountBalance: newBal.toFixed(2),
      },
      newTransactionSender,
      newTransactionReceiver,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export { TransactionDetails };
