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
exports.StatementDetail = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Models_1 = require("../model/Models");
const StatementDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const userStatement = yield Models_1.Statement.findAll({
            where: { accountId: user.id },
        });
        return res.status(200).json({ message: userStatement });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.StatementDetail = StatementDetail;
