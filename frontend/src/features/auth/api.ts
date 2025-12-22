import { axiosClient } from "../../lib/axiosClient";
import type { UserRole } from "./types";

export type LoginResponse = {
  token: string;
  userId: string;
  name: string;
  role: UserRole;
};

export const login = async (
  loginId: string,
  password: string,
): Promise<LoginResponse> => {
  const response = await axiosClient.post<LoginResponse>("/login", { loginId, password });
  return response.data;
};
