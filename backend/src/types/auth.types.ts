export type OAuthFlowAction =
  | "register_new_user"
  | "link_new_gmail_account"
  | "reauthenticate"
  | "login";

export interface ValidatedUser {
  name: string;
  email: string;
  sub: string;
  refresh_token: string;
}
