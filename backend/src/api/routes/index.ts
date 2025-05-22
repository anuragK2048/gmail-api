import express, { Router } from "express";
import authRouter from "./auth.routes";
import userRouter from "./user.routes";
import gmailAccountRouter from "./gmailAccount.routes";
import emailRouter from "./email.routes";

const router: Router = express.Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/gmail-accounts", gmailAccountRouter);
router.use("/emails", emailRouter);

export default router;
