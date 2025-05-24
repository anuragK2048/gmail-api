// generate oauthflowcontent
import { GOOGLE_CLIENT_ID, baseOauth2Client, GMAIL_SCOPES } from "../config";

export const generateGoogleOAuthURL = (csrfToken: string) => {
  const authorizationUrl = baseOauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: GMAIL_SCOPES,
    prompt: "consent",
    state: csrfToken,
  });
  return authorizationUrl;
};

export const validateUser = async (code) => {
  try {
    const { tokens } = await baseOauth2Client.getToken(code);
    baseOauth2Client.setCredentials(tokens);
    if (tokens.id_token) {
      const loginTicket = await baseOauth2Client.verifyIdToken({
        idToken: tokens.id_token,
        audience: GOOGLE_CLIENT_ID,
      });
      const payload = loginTicket.getPayload();
      if (!payload) {
        throw new Error("Invalid ID token payload");
      }
      payload.refresh_token = tokens.refresh_token;
      return payload;
    } else {
      throw new Error("ID token missing from Google response.");
    }
  } catch (err) {
    throw new Error("Error in validating user");
  }
};
