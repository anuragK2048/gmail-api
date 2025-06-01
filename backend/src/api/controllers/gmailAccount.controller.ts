import { Request, Response } from "express";
import { asyncWrapper } from "../../middleware/asyncWrapper";
import { BadRequestError } from "../../errors/specificErrors";
import { UUID } from "crypto";
import {
  deleteGmailAccount,
  getUserIdByGmailAccountId,
} from "../../database/gmail_accounts.db";
import { revokeGoogleToken } from "../../services/token.service";

export const getEmails = async (req: Request, res: Response) => {
  res.json({});
};

export const listLinkedAccounts = async (req: Request, res: Response) => {
  res.json({});
};

export const unlinkGmailAccount = asyncWrapper(
  async (req: Request, res: Response) => {
    if (!req.params.accountId) {
      throw new BadRequestError(
        "Account Id for account removal not provided in parameters",
        "ACCOUNT_ID_UNAVAILABLE"
      );
    }
    const { accountId } = req.params as { accountId: UUID };
    const appUserId: UUID = req.session.userId!;
    const {
      app_user_id: gmailOwnerId,
      refresh_token_encrypted,
      type,
    } = await getUserIdByGmailAccountId(accountId);
    // verify account owner
    if (appUserId !== gmailOwnerId) {
      throw new BadRequestError(
        "Owner of this email account is different",
        "BAD_REQUEST"
      );
    }
    // check if it is primary google account
    if (type === "primary")
      throw new BadRequestError("Cant disconnect primary account");
    // decrypt refresh token
    const result = revokeGoogleToken(refresh_token_encrypted);
    if (result == "error") {
    } // error in revoking refresh token
    // delete gmail account from DB
    await deleteGmailAccount(accountId);
    res
      .status(200)
      .json({ message: "Gmail Account Disconnected Successfully" });
  }
);

export const triggerAccountSync = async (req: Request, res: Response) => {
  res.json({});
};

export const getAccountSyncStatus = async (req: Request, res: Response) => {
  res.json({});
};
