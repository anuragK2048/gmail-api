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
import {
  createEmailAccount,
  duplicateAccountCheck,
} from "../../database/gmail_accounts.db";
import { ValidatedUser } from "../../types/auth.types";

// When new user clicks sign in
export const redirectToGoogle = async (req: Request, res: Response) => {
  const csrfToken: string = generateCSRFtoken();
  req.session.oauthFlowContent = {
    csrfToken: csrfToken,
    action: "register_new_user/login",
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
      }: ValidatedUser = await validateUser(code);
      if (req.session.oauthFlowContent.action == "register_new_user/login") {
        const newUserAccountPayload: NewUserAccountPayload = {
          full_name,
          gmail_accounts: [primary_email],
          primary_email,
          google_id,
        };
        const userData: User = await createUser(newUserAccountPayload); // D.B.
        const newGmailDetails: NewGmailAccountPayload = {
          gmail_name: userData.full_name,
          app_user_id: userData.id,
          google_user_id_for_account: userData.google_id,
          gmail_address: userData.primary_email,
          refresh_token_encrypted,
        };
        const gmailAccountData: GmailAccount = await createEmailAccount(
          newGmailDetails
        );
        req.session.userId = userData.id;
        req.session.isLoggedIn = true;
        delete req.session.oauthFlowContent;
        res.redirect(FRONTEND_URL);
      } else if (
        req.session.userId &&
        req.session.oauthFlowContent.action == "link_new_gmail_account"
      ) {
        const newGmailDetails: NewGmailAccountPayload = {
          gmail_name: full_name,
          app_user_id: req.session.userId,
          google_user_id_for_account: google_id,
          gmail_address: primary_email,
          refresh_token_encrypted,
        };
        // if (!(await duplicateAccountCheck(google_id))) {  // It should return false //TODO
        if (true) {
          // It should return false
          try {
            const gmailAccountData: GmailAccount = await createEmailAccount(
              newGmailDetails
            );
            res.redirect(
              FRONTEND_URL + `/inbox?selectedAccountId=${gmailAccountData.id}`
            );
          } catch (err) {
            console.error("Error in creating new gmail row in DB", err);
            res.redirect(FRONTEND_URL + "-error" + `?${err}`);
          }
        } else {
          console.error(`${primary_email} already exist with this user`);
          res.redirect(
            FRONTEND_URL + "-error" + `?${primary_email} already exist with you`
          );
        }
      }
    } catch (err) {
      console.error("Unable to validate user account: ", err);
      res.redirect(FRONTEND_URL + "-error" + `?${err}`);
    }
  }
  res.redirect(FRONTEND_URL + "-error");
};

// export const getAuthStatus = async (req: Request, res: Response) => {
//   res.json({});
// };

export const logoutUser = async (req: Request, res: Response) => {
  res.json({});
};

export const initiateLinkGoogleAccount = async (
  req: Request,
  res: Response
) => {
  const csrfToken: string = generateCSRFtoken();
  req.session.oauthFlowContent = {
    csrfToken: csrfToken,
    action: "link_new_gmail_account",
  };
  req.session.save();
  const authURL = generateGoogleOAuthURL(csrfToken);
  res.redirect(authURL);
};
