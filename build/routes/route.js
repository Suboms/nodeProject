"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const transactionControllers_1 = require("../controllers/transactionControllers");
const statementController_1 = require("../controllers/statementController");
const router = express_1.default.Router();
exports.router = router;
router.post("/signup", userController_1.Signup);
router.post("/login", userController_1.Login);
router.post("/transaction", transactionControllers_1.TransactionDetails);
router.get("/userprofile", userController_1.userProfile);
router.get("/statement", statementController_1.StatementDetail);
