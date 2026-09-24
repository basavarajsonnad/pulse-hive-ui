export const SUCCESS = "success";
export const ERROR = "error";

// Entra ID's default SAML claim URIs for email and group claims.
export const TENANT_FORM_INITIAL_VALUES = {
  liscencePackage: "basic",
  sso: {
    emailAttribute:
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
    groupsAttribute:
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/groups",
  },
};

export const DEFAULT_PAGE_SIZE = 10;
