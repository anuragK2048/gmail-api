import { Request, Response } from "express";
import { generateCSRFtoken } from "../../utils/crypto.utils";
import {
  generateGoogleOAuthURL,
  validateUser,
} from "../../services/auth.service";
import { createUser } from "../../database/users.db";
import crypto from "crypto";
import { FRONTEND_URL } from "../../config";
import { GmailAccount, NewGmailAccountPayload } from "../../types/gmail.types";
import { NewUserAccountPayload, User } from "../../types/user.types";
import { createEmailAccount } from "../../database/gmail_accounts.db";

// When new user clicks sign in
export const redirectToGoogle = async (req: Request, res: Response) => {
  const csrfToken: string = generateCSRFtoken();
  req.session.oauthFlowContent = {
    csrfToken: csrfToken,
    action: "primary-login",
  };
  req.session.save();
  const authURL = generateGoogleOAuthURL(csrfToken);
  res.redirect(authURL);
};

export const handleGoogleCallback = async (req: Request, res: Response) => {
  if (!req.query.code || !req.query.state) {
    console.log("Error in callback URL(not enough details)");
    res.json({ message: "Error in callback URL(not enough details)" });
  }
  const { state, code }: { state?: string; code?: string } = req.query;
  if (
    req.session.oauthFlowContent &&
    state == req.session.oauthFlowContent.csrfToken
  ) {
    // State verified
    try {
      const {
        name: full_name,
        email: primary_email,
        sub: google_id,
        refresh_token: refresh_token_encrypted,
      } = await validateUser(code);
      const newUserAccountPayload: NewUserAccountPayload = {
        full_name,
        gmail_accounts: [primary_email],
        primary_email,
        google_id,
      };
      const userData: User = await createUser(newUserAccountPayload); // D.B.
      const newGmailDetails: NewGmailAccountPayload = {
        app_user_id: userData.id,
        google_user_id_for_account: userData.google_id,
        gmail_address: userData.primary_email,
        refresh_token_encrypted,
      };
      const gmailAccountData: GmailAccount = await createEmailAccount(
        newGmailDetails
      );
      req.session.userId = crypto.randomBytes(16).toString("hex");
      req.session.isLoggedIn = true;
      res.redirect(FRONTEND_URL);
    } catch (err) {
      console.error("Unable to validate user: ", err);
      res.status(500).json({ message: "Unable to validate user" });
    }
  }
  res.status(500).json({ message: "Cant verify URL state" });
};

// export const getAuthStatus = async (req: Request, res: Response) => {
//   res.json({});
// };

// export const logoutUser = async (req: Request, res: Response) => {
//   res.json({});
// };

// export const initiateLinkGoogleAccount = async (
//   req: Request,
//   res: Response
// ) => {
//   res.json({});
// };
