import { Request, Response } from "express";
import { generateCSRFtoken } from "../../utils/crypto.utils";
import {
  generateGoogleOAuthURL,
  validateUser,
} from "../../services/auth.service";
import { createUser } from "../../database/auth.db";
import crypto from "crypto";
import { FRONTEND_URL } from "../../config";

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
  const { state, code } = req.query;
  if (state == req.session.oauthFlowContent.csrfToken) {
    // State verified
    try {
      const { name, email, sub } = await validateUser(code);
      await createUser(name, "", [email], email, sub); // D.B.
      req.session.userId = crypto.randomBytes(16).toString("hex");
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
