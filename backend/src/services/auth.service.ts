// generate oauthflowcontent
import { GOOGLE_CLIENT_ID, baseOauth2Client, GMAIL_SCOPES } from "../config";
import { BadRequestError } from "../errors/specificErrors";

export const generateGoogleOAuthURL = (csrfToken: string) => {
  const authorizationUrl = baseOauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: GMAIL_SCOPES,
    prompt: "consent",
    state: csrfToken,
  });
  return authorizationUrl;
};

export const validateUser = async (code?: string) => {
  const { tokens } = await baseOauth2Client.getToken(code);
  if (!tokens?.refresh_token)
    throw new BadRequestError(
      "Could not obtain necessary permissions (refresh token) from Google to link account. Please ensure you grant offline access.",
      "GOOGLE_REFRESH_TOKEN_MISSING"
    );
  baseOauth2Client.setCredentials(tokens);
  if (tokens.id_token) {
    const loginTicket = await baseOauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = loginTicket.getPayload();
    if (!payload) {
      throw new BadRequestError("Invalid ID token payload", "INVALID_ID_TOKEN");
    }
    payload.refresh_token = tokens.refresh_token;
    return payload;
  } else {
    throw new BadRequestError(
      "ID token missing from Google response.",
      "MISSING_GOOGLE_ID_TOKEN"
    );
  }
};
