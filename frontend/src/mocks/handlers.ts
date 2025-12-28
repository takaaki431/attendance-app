import { HttpResponse, http } from "msw";
import type { AttendanceRecord } from "../features/attendance/types";

type UserProfile = {
  userId: string;
  name: string;
  role: "employee" | "admin";
  token: string;
};

const users: Record<string, UserProfile> = {
  admin: { userId: "admin", name: "管理者", role: "admin", token: "token-admin" },
  "001": { userId: "001", name: "田中", role: "employee", token: "token-employee" },
};

const attendanceStore = new Map<string, AttendanceRecord>();

const getTodayKey = () => new Date().toISOString().slice(0, 10);

const getUserIdFromRequest = (request: Request) => {
  const explicitUserId = request.headers.get("x-user-id");
  if (explicitUserId) return explicitUserId;

  const authorization = request.headers.get("authorization");
  if (authorization?.startsWith("Bearer ")) {
    const token = authorization.replace("Bearer ", "").trim();
    const matchedUser = Object.values(users).find((user) => user.token === token);
    return matchedUser?.userId ?? null;
  }

  return null;
};

const requireAuth = (request: Request) => {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return {
      error: HttpResponse.json({ message: "未認証です" }, { status: 401 }),
    };
  }

  return { userId };
};

const resolveAttendance = (userId: string) => {
  const key = `${userId}-${getTodayKey()}`;
  const record = attendanceStore.get(key) ?? { status: "not_started" };
  return { key, record };
};

export const handlers = [
  http.post("/api/login", async ({ request }) => {
    const { loginId, password } = (await request.json()) as {
      loginId: string;
      password: string;
    };

    if (loginId === "admin" && password === "pass") {
      const profile = users.admin;
      return HttpResponse.json({
        token: profile.token,
        userId: profile.userId,
        name: profile.name,
        role: profile.role,
      });
    }

    if (loginId === "001" && password === "pass") {
      const profile = users["001"];
      return HttpResponse.json({
        token: profile.token,
        userId: profile.userId,
        name: profile.name,
        role: profile.role,
      });
    }

    return HttpResponse.json(
      { message: "社員番号またはパスワードが正しくありません" },
      { status: 401 },
    );
  }),

  http.get("/api/attendance/today", ({ request }) => {
    const auth = requireAuth(request);
    if ("error" in auth) {
      return auth.error;
    }

    const { record } = resolveAttendance(auth.userId);
    return HttpResponse.json(record);
  }),

  http.post("/api/attendance/clock-in", ({ request }) => {
    const auth = requireAuth(request);
    if ("error" in auth) {
      return auth.error;
    }

    const { key, record } = resolveAttendance(auth.userId);

    if (record.status === "working") {
      return HttpResponse.json({ message: "すでに出勤済みです" }, { status: 409 });
    }

    if (record.status === "completed") {
      return HttpResponse.json({ message: "すでに退勤済みです" }, { status: 409 });
    }

    const now = new Date().toISOString();
    const updated: AttendanceRecord = {
      status: "working",
      clockInAt: now,
      clockOutAt: record.clockOutAt,
    };
    attendanceStore.set(key, updated);

    return HttpResponse.json(updated);
  }),

  http.post("/api/attendance/clock-out", ({ request }) => {
    const auth = requireAuth(request);
    if ("error" in auth) {
      return auth.error;
    }

    const { key, record } = resolveAttendance(auth.userId);

    if (record.status === "not_started") {
      return HttpResponse.json({ message: "先に出勤をしてください" }, { status: 400 });
    }

    if (record.status === "completed") {
      return HttpResponse.json({ message: "すでに退勤済みです" }, { status: 409 });
    }

    const now = new Date().toISOString();
    const updated: AttendanceRecord = {
      status: "completed",
      clockInAt: record.clockInAt,
      clockOutAt: now,
    };
    attendanceStore.set(key, updated);

    return HttpResponse.json(updated);
  }),
];
