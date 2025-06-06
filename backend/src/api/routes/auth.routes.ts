import express, { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { isAuthenticated } from "../../middleware/isAuthenticated";

const router: Router = express.Router();

// Route to initiate Google OAuth flow
// GET /api/v1/auth/google
router.get("/google", authController.redirectToGoogle);

// Route for Google OAuth callback
// GET /api/v1/auth/google/callback
router.get("/google/callback", authController.handleGoogleCallback);

// // Route to get current authentication status
// // GET /api/v1/auth/status
// router.get("/status", isAuthenticated, authController.getAuthStatus); // Protected by isAuthenticated

// // Route for user logout
// // POST /api/v1/auth/logout
router.post("/logout", isAuthenticated, authController.logoutUser); // Protected

// // Route to initiate linking another Gmail account (example, assuming user is already logged in)
// POST /api/v1/auth/google/link
router.get(
  "/google/link",
  isAuthenticated,
  authController.initiateLinkGoogleAccount
);

export default router;
