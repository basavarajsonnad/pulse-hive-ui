import { API_URL, API_VERSION } from "@/utils/constants/apiConstants";
import { LOGIN } from "@/utils/constants/urlConstants";

export const LOGIN_URL = `${API_URL}${API_VERSION}${LOGIN}`;

export const redirectToLogin = () => {
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.href = LOGIN_URL;
};
