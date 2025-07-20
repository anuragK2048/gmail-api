import express, { Router } from "express";
import authRouter from "./auth.routes";
import userRouter from "./user.routes";
import gmailAccountRouter from "./gmailAccount.routes";
import emailRouter from "./email.routes";
import labelRouter from "./label.routes";

const router: Router = express.Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/gmail-accounts", gmailAccountRouter);
router.use("/emails", emailRouter);
router.use("/labels", labelRouter);

export default router;
