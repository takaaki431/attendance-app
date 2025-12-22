import { create } from "zustand";
import type { AuthPayload, AuthStateShape } from "./types";

type AuthStore = AuthStateShape & {
  setAuth: (payload: AuthPayload) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  userId: null,
  name: null,
  role: null,
  token: null,
  setAuth: (payload) =>
    set({
      userId: payload.userId,
      name: payload.name,
      role: payload.role,
      token: payload.token,
    }),
  clearAuth: () =>
    set({
      userId: null,
      name: null,
      role: null,
      token: null,
    }),
}));
