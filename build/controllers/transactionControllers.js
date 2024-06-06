"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionDetails = void 0;
const Models_1 = require("../model/Models");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const decimal_js_1 = __importDefault(require("decimal.js"));
const TransactionDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = req.headers.authorization;
        if (!accessToken) {
            return res.status(401).json({ error: "Access token is missing" });
        }
        const token = accessToken.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Token is missing" });
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const { email } = decodedToken;
        const user = yield Models_1.User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "User does not exist" });
        }
        const { transactionAmount, transactionDestination, destinationBank, description, } = req.body;
        const date = new Date();
        const parsedTransactionAmount = new decimal_js_1.default(transactionAmount);
        const destinationAccount = parseInt(transactionDestination);
        if (isNaN(destinationAccount) ||
            destinationAccount.toString().length !== 10) {
            return res.status(400).json({ error: "Invalid account number" });
        }
        if (parsedTransactionAmount.isNaN() ||
            parsedTransactionAmount.lessThanOrEqualTo(99.99)) {
            return res.status(400).json({ error: "Invalid transaction amount" });
        }
        const userAccount = yield Models_1.AccountDetails.findOne({
            where: { userId: user.id },
        });
        if (!userAccount) {
            return res
                .status(404)
                .json({ error: "Cannot find an account associated with this user" });
        }
        const destinationAccountExists = yield Models_1.AccountDetails.findOne({
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
        const initialBal = new decimal_js_1.default(userAccount.dataValues.accountBalance);
        const newBal = initialBal.minus(parsedTransactionAmount);
        if (newBal.lessThan(500)) {
            return res.status(403).json({ error: "Insufficient funds" });
        }
        const transactionTypeSender = "debit";
        const transactionTypeReceiver = "credit";
        // Create transaction for sender (debit)
        const newTransactionSender = yield Models_1.Transaction.create({
            accountId: userAccount.dataValues.id,
            transactionAmount: parsedTransactionAmount.toFixed(2),
            transactionDestination: destinationAccount,
            destinationBank,
            description,
            transactionDate: date.toISOString(),
            transactionType: transactionTypeSender,
        });
        // Update sender's account balance
        yield Models_1.AccountDetails.update({ accountBalance: newBal.toFixed(2) }, { where: { accountNum: userAccount.dataValues.accountNum } });
        // Create transaction for receiver (credit)
        const newTransactionReceiver = yield Models_1.Transaction.create({
            accountId: destinationAccountExists.dataValues.id,
            transactionAmount: parsedTransactionAmount.toFixed(2),
            transactionDestination: userAccount.dataValues.accountNum,
            destinationBank,
            description,
            transactionDate: date.toISOString(),
            transactionType: transactionTypeReceiver,
        });
        // Update receiver's account balance
        const newDestinationBal = new decimal_js_1.default(destinationAccountExists.dataValues.accountBalance)
            .plus(parsedTransactionAmount)
            .toFixed(2);
        yield Models_1.AccountDetails.update({ accountBalance: newDestinationBal }, { where: { accountNum: destinationAccount } });
        // Save statement for sender
        const statementDataSender = {
            transactionAmount: parsedTransactionAmount.toFixed(2),
            transactionDestination: destinationAccount,
            destinationBank,
            description,
            transactionDate: date.toISOString(),
            transactionType: transactionTypeSender,
            accountBalance: newBal.toFixed(2),
        };
        yield Models_1.Statement.create({
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
            accountBalance: newDestinationBal,
        };
        yield Models_1.Statement.create({
            accountId: destinationAccountExists.dataValues.userId,
            statementData: statementDataReceiver,
        });
        return res.status(200).json({
            message: "Transaction Successful",
            userAccount: Object.assign(Object.assign({}, userAccount.dataValues), { accountBalance: newBal.toFixed(2) }),
            newTransactionSender,
            newTransactionReceiver,
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.TransactionDetails = TransactionDetails;
