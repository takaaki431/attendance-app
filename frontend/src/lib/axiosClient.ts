import axios from "axios";
import { useAuthStore } from "../features/auth/store";

export const axiosClient = axios.create({
  baseURL: "/api",
});

axiosClient.interceptors.request.use((config) => {
  const { token, userId } = useAuthStore.getState();
  const headers = {
    ...config.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(userId ? { "X-User-Id": userId } : {}),
  };

  return {
    ...config,
    headers,
  };
});
