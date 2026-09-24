import axios from "axios";
import {
  API_URL,
  API_VERSION,
  REQUEST_TIMEOUT_MS,
} from "@/utils/constants/apiConstants";

const axiosInstance = axios.create({
  baseURL: `${API_URL}${API_VERSION}`,
  timeout: REQUEST_TIMEOUT_MS,
});

export default axiosInstance;
