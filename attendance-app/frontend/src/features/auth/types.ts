export type UserRole = "employee" | "admin";

export type AuthPayload = {
  userId: string;
  name: string;
  role: UserRole;
  token: string;
};

export type AuthStateShape = {
  userId: string | null;
  name: string | null;
  role: UserRole | null;
  token: string | null;
};
