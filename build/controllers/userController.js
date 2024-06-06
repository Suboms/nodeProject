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
exports.userProfile = exports.Login = exports.Signup = void 0;
const Models_1 = require("../model/Models");
const bcrypt_1 = __importDefault(require("bcrypt"));
require("dotenv/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const minaccountNum = 5e9;
    const maxaccountNum = 6e9 - 1;
    try {
        const { email, firstName, lastName, userName, password } = req.body;
        const missingFields = [];
        if (!email)
            missingFields.push("email");
        if (!firstName)
            missingFields.push("firstName");
        if (!lastName)
            missingFields.push("lastName");
        if (!userName)
            missingFields.push("userName");
        if (!password)
            missingFields.push("password");
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: "The following fields are required",
                missingFields: missingFields,
            });
        }
        const isUser = yield Models_1.User.findOne({ where: { email } });
        if (isUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const newUser = yield Models_1.User.create({
            email,
            firstName,
            lastName,
            userName,
            password: hashedPassword,
        });
        const newAccount = yield Models_1.AccountDetails.create({
            userId: newUser.id,
            accountNum: BigInt(Math.floor(minaccountNum + Math.random() * (maxaccountNum - minaccountNum + 1))).toString(),
            accountBalance: 200000000,
        });
        return res.status(201).json({ user: newUser, account: newAccount });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.Signup = Signup;
const Login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = yield Models_1.User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const validPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const payload = {
            id: user.id,
            email: user.email,
            userName: user.userName,
        };
        const accessToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
            expiresIn: 1800,
        });
        const refreshToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "365d",
        });
        return res.status(200).json({ accessToken, refreshToken });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.Login = Login;
const userProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = req.headers.authorization;
        if (!accessToken) {
            return res.status(401).json({ error: "Access token is missing" });
        }
        const token = accessToken.split(" ")[1];
        if (!token || token === "null") {
            return res.status(401).json({ error: "Token is missing" });
        }
        let decodedToken;
        try {
            decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        }
        catch (err) {
            return res.status(401).json({ error: "Invalid token" });
        }
        const { email } = decodedToken;
        const user = yield Models_1.User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "User does not exist" });
        }
        const userAccount = yield Models_1.AccountDetails.findOne({
            where: { userId: user.id },
        });
        return res.status(200).json({ user, userAccount });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.userProfile = userProfile;
