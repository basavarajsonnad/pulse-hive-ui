import { API_URL, API_VERSION } from "@/utils/constants/apiConstants";
import { LOGIN_API } from "@/utils/constants/urlConstants";

export const getLoginUrl = () => `${API_URL}${API_VERSION}${LOGIN_API.LOGIN}`;

export const redirectToLogin = () => {
  window.location.href = getLoginUrl();
};
