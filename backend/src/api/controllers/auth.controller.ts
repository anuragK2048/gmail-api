import { Request, Response } from "express";
import { generateCSRFtoken } from "../../utils/crypto.utils";
import {
  generateGoogleOAuthURL,
  validateUser,
} from "../../services/auth.service";
import {
  createUser,
  findGmailAccountByGoogleId,
} from "../../database/users.db";
import { FRONTEND_URL, NODE_ENV } from "../../config";
import { GmailAccount, NewGmailAccountPayload } from "../../types/gmail.types";
import { NewUserAccountPayload, User } from "../../types/user.types";
import {
  createEmailAccount,
  duplicateAccountCheck,
} from "../../database/gmail_accounts.db";
import { ValidatedUser } from "../../types/auth.types";
import { asyncWrapper } from "../../middleware/asyncWrapper";
import {
  BadRequestError,
  ForbiddenError,
  InternalServerError,
  UnauthorizedError,
} from "../../errors/specificErrors";

// When new user clicks sign in
export const redirectToGoogle = async (req: Request, res: Response) => {
  const csrfToken: string = generateCSRFtoken();
  req.session.oauthFlowContent = {
    csrfToken: csrfToken,
    action: "register_new_user/login",
  };
  req.session.save((err) => {
    if (err) console.error("🔴 Error in saving session");
  });
  const authURL = generateGoogleOAuthURL(csrfToken);
  res.redirect(authURL);
};

export const handleGoogleCallback = asyncWrapper(
  async (req: Request, res: Response) => {
    const { state, code } = req.query;
    if (
      !state ||
      typeof state !== "string" ||
      !code ||
      typeof code !== "string"
    ) {
      console.log("Error in callback URL(not enough details)");
      throw new BadRequestError(
        "Missing authorization code or state parameter.",
        "AUTH_MISSING_PARAMS"
      );
    }
    if (
      !req.session.oauthFlowContent ||
      state !== req.session.oauthFlowContent.csrfToken
    ) {
      console.error(
        "CSRF token mismatch or missing flow context in Google callback."
      );
      // Invalidate session potentially?
      throw new UnauthorizedError(
        "Invalid session or CSRF token. Please try again.",
        "CSRF_INVALID"
      );
    }
    // State verified

    const {
      name: full_name,
      email: new_email,
      sub: google_id,
      refresh_token: refresh_token_encrypted,
    }: ValidatedUser = await validateUser(code);
    if (req.session.oauthFlowContent.action == "register_new_user/login") {
      // Check if this Google account (googleUser.sub) is already linked to ANY app_user
      const existingGmailLink = await duplicateAccountCheck(google_id);
      if (existingGmailLink) {
        console.log("LOGIN");
        // Login
        req.session.userId = existingGmailLink.app_user_id;
        req.session.isLoggedIn = true;
        res.redirect(FRONTEND_URL + `/${existingGmailLink.id}`);
      } else {
        // Register new user
        console.log("REGISTERING NEW USER");
        const newUserAccountPayload: NewUserAccountPayload = {
          full_name,
          gmail_accounts: [new_email],
          primary_email: new_email,
          google_id,
        };
        const userData: User = await createUser(newUserAccountPayload); // D.B.
        const newGmailDetails: NewGmailAccountPayload = {
          gmail_name: userData.full_name,
          app_user_id: userData.id,
          google_user_id_for_account: userData.google_id,
          gmail_address: userData.primary_email,
          refresh_token_encrypted,
          type: "primary",
        };
        const gmailAccountData: GmailAccount = await createEmailAccount(
          newGmailDetails
        );
        // Creating user session
        req.session.userId = userData.id;
        req.session.isLoggedIn = true;
        req.session.save((err) => {
          if (err) console.error("🔴 Error in saving session");
        });
        delete req.session.oauthFlowContent;
        res.redirect(FRONTEND_URL + `/${gmailAccountData.id}`);
      }
    } else if (
      req.session.userId &&
      req.session.oauthFlowContent.action == "link_new_gmail_account"
    ) {
      const newGmailDetails: NewGmailAccountPayload = {
        gmail_name: full_name,
        app_user_id: req.session.userId,
        google_user_id_for_account: google_id,
        gmail_address: new_email,
        refresh_token_encrypted,
        type: "secondary",
      };
      // if (await duplicateAccountCheck(google_id)) {
      //      console.error(`${new_email} already exist with this user`);
      //     throw new ForbiddenError(`Gmail account ${new_email} is already linked to an account in our system or to your own account.`, 'ACCOUNT_ALREADY_LINKED');
      //  } // It should return false //TODO

      const gmailAccountData: GmailAccount = await createEmailAccount(
        newGmailDetails
      );
      delete req.session.oauthFlowContent;
      res.redirect(FRONTEND_URL + `/${gmailAccountData.id}`);
    }
    // res.redirect(FRONTEND_URL + "-error");
  }
);

// export const getAuthStatus = async (req: Request, res: Response) => {
//   res.json({});
// };

export const logoutUser = async (req: Request, res: Response) => {
  const sessionCookieName = "connect.sid"; // Get name from session obj or default

  req.session.destroy((err) => {
    if (err) {
      console.error("🔴 Error in destroying session", err);
    }

    // Options must match those used when setting the cookie
    const cookieOptions = {
      path: "/", // Default path if not specified in session config, otherwise match
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "lax" as const, // Match the type from session config
    };

    res.clearCookie(sessionCookieName, cookieOptions);

    if (err) {
      throw new InternalServerError("Logout partially failed");
    }
    return res.status(200).json({ message: "Logout successful." });
  });
};

export const initiateLinkGoogleAccount = (req: Request, res: Response) => {
  const csrfToken: string = generateCSRFtoken();
  req.session.oauthFlowContent = {
    csrfToken: csrfToken,
    action: "link_new_gmail_account",
  };
  req.session.save((err) => {
    if (err) console.error("🔴 Error in saving session");
  });
  const authURL = generateGoogleOAuthURL(csrfToken);
  res.redirect(authURL);
};
