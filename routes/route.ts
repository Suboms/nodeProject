import express from "express";
import { Login, Signup } from "../controllers/userController";
import { TransactionDetails } from "../controllers/transactionControllers";

const router = express.Router();
router.post("/signup", Signup);
router.post("/login", Login);
router.get("/transaction", TransactionDetails)

export {router};