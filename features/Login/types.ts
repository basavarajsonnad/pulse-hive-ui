export interface ILoginUserDetails {
  access_token: string;
  [key: string]: unknown;
}

export interface ILoginState {
  authToken: string | null;
  userDetails: ILoginUserDetails | null;
}
