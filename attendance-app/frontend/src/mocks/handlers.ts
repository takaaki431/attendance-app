import { HttpResponse, http } from "msw";

export const handlers = [
  http.post("/api/login", async ({ request }) => {
    const { loginId, password } = (await request.json()) as {
      loginId: string;
      password: string;
    };

    if (loginId === "admin" && password === "pass") {
      return HttpResponse.json({
        token: "token-admin",
        userId: "admin",
        name: "管理者",
        role: "admin",
      });
    }

    if (loginId === "001" && password === "pass") {
      return HttpResponse.json({
        token: "token-employee",
        userId: "001",
        name: "田中",
        role: "employee",
      });
    }

    return HttpResponse.json(
      { message: "社員番号またはパスワードが正しくありません" },
      { status: 401 },
    );
  }),
];
