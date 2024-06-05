import express from "express";
import { Login, Signup, userProfile } from "../controllers/userController";
import { TransactionDetails } from "../controllers/transactionControllers";
import { StatementDetail } from "../controllers/statementController";

const router = express.Router();
router.post("/signup", Signup);
router.post("/login", Login);
router.post("/transaction", TransactionDetails)
router.get("/userprofile", userProfile)
router.get("/statement", StatementDetail)

export {router};