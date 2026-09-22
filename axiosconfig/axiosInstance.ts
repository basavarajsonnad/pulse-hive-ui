import axios from "axios";
import { API_URL, API_VERSION } from "@/utils/constants/apiConstants";

const axiosInstance = axios.create({
  baseURL: `${API_URL}${API_VERSION}`,
});

export default axiosInstance;
