You are an expert frontend engineer.  
I am building a small attendance management system as a portfolio for a frontend position at a SaaS company.

## Goal

In a Vite + React + TypeScript project (`frontend`), implement the **UI-side application** for a simple attendance system according to the following requirements.

For this prompt, focus on:

- setting up the basic app structure
- routing
- layout
- auth state (employee/admin)
- login screen UI + logic (calling a mocked API)
- simple placeholder pages for employee/admin

We will connect real APIs and add more features later.

---

## Functional requirements (UI side)

**Roles**

- `employee` (一般社員)
- `admin` (社長・管理者)

**Login**

- Users log in with:
  - employee number: `loginId` (社員番号)
  - `password`
- On successful login, backend returns:
  - `token` (string)
  - `userId` (string)
  - `name` (string)
  - `role`: `"employee"` or `"admin"`

**Routing after login**

- If `role === "employee"` → redirect to `/employee`
- If `role === "admin"` → redirect to `/admin`

**Employee page `/employee` (for now as placeholder)**

- Shows:
  - Welcome text with user name (e.g. “田中さん、こんにちは”)
  - Today’s date
  - A placeholder box for “Today’s attendance status”
  - Placeholder buttons for “Clock-in” / “Clock-out” (no real API yet)
- Later we’ll connect to attendance APIs, but for now layout and routing is enough.

**Admin page `/admin` (for now as placeholder)**

- Shows:
  - Title “管理者ダッシュボード”
  - A simple table header for “社員名 / 出勤時刻 / 退勤時刻 / ステータス”
  - Some dummy static rows so the UI looks like an admin dashboard

---

## Tech stack & libraries to use

Use these libraries and patterns:

- React 18 + TypeScript
- Vite
- React Router (`react-router-dom`)
- MUI (Material UI) for UI components
- Zustand for auth state management
- TanStack React Query for data fetching
- axios for API calls
- React Hook Form + zod for form + validation
- msw (Mock Service Worker) for mocked `/api/login` endpoint

In this step, implement:

- actual login flow calling `/api/login` via msw
- correct redirect based on `role`
- auth state stored in Zustand
- protected routes for `/employee` and `/admin` (redirect to `/login` if not logged in)

---

## Folder structure

Assume the Vite React + TS template already exists.
Please create/update files under `src/` like this:

- `src/main.tsx`
- `src/App.tsx`
- `src/routes/LoginPage.tsx`
- `src/routes/EmployeeHomePage.tsx`
- `src/routes/AdminDashboardPage.tsx`
- `src/components/layout/AppLayout.tsx`
- `src/features/auth/store.ts`
- `src/features/auth/api.ts`
- `src/features/auth/hooks.ts`
- `src/features/auth/types.ts`
- `src/lib/axiosClient.ts`
- `src/lib/queryClient.ts`
- `src/styles/theme.ts`
- `src/mocks/handlers.ts`
- `src/mocks/browser.ts`

You can create additional small helper files if necessary, but keep things simple.

---

## Auth state design (Zustand)

Create a Zustand store in `src/features/auth/store.ts` like:

- state:
  - `userId: string | null`
  - `name: string | null`
  - `role: "employee" | "admin" | null`
  - `token: string | null`
- actions:
  - `setAuth(payload)` to set them after login
  - `clearAuth()` to log out

We will later extend this store, so keep it clean and simple.

---

## Login API design

- Create `src/lib/axiosClient.ts` with an axios instance using `baseURL: "/api"`.
- Create `src/features/auth/api.ts` with:

  ```ts
  export type LoginResponse = {
    token: string;
    userId: string;
    name: string;
    role: "employee" | "admin";
  };

  export const login = async (loginId: string, password: string): Promise<LoginResponse> => {
    // use axiosClient.post("/login", { loginId, password })
  };

* Create `src/features/auth/hooks.ts` with:

  ```ts
  import { useMutation } from "@tanstack/react-query";

  export const useLoginMutation = () => {
    return useMutation({
      mutationFn: ({ loginId, password }: { loginId: string; password: string }) =>
        login(loginId, password),
    });
  };
  ```

---

## msw mock for `/api/login`

In `src/mocks/handlers.ts`:

* Define a `rest.post("/api/login", ...)` handler.
* Implement simple dummy logic:

  * If `loginId === "admin"` and `password === "pass"` → return role `"admin"`.
  * If `loginId === "001"` and `password === "pass"` → return role `"employee"`.
  * Otherwise return `401` with error message.

In `src/mocks/browser.ts`:

* Setup `worker = setupWorker(...handlers)`.

In `src/main.tsx`:

* In development mode (`import.meta.env.DEV`), start the worker before rendering React.

You may use top-level `await` or a small bootstrap function, whichever is more convenient for Vite.

---

## React Query / Theme / Router wiring

* Create `src/lib/queryClient.ts` with a `new QueryClient()` and export it.
* Create `src/styles/theme.ts` with a simple MUI theme (can be mostly default).
* In `main.tsx`, wrap the app with:

  * `QueryClientProvider`
  * `ThemeProvider`
  * `CssBaseline`
  * `BrowserRouter`

Example structure (adjust as needed):

```tsx
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
```

---

## Routing and layout

### `App.tsx`

* Use `Routes` and `Route` from `react-router-dom`.

* Define routes:

  * `/login` → `LoginPage`
  * `/employee` → `EmployeeHomePage`
  * `/admin` → `AdminDashboardPage`
  * `*` → redirect to `/login`

* Implement a simple `RequireAuth` component inside `App.tsx` or a separate file:

  * If no `token` in auth store → redirect to `/login`.
  * Optionally accept `requiredRole?: "employee" | "admin"` to protect `/admin`.

### `AppLayout`

* Basic layout with a header and content area.
* Header can show:

  * App title (e.g. “勤怠管理システム”)
  * Logged-in user name (if any)
  * A “ログアウト” button that calls `clearAuth()` and redirects to `/login`.

---

## LoginPage implementation

In `src/routes/LoginPage.tsx`:

* Use React Hook Form + zod for validation:

  * `loginId`: required
  * `password`: required
* Use MUI `TextField` and `Button` components.
* On submit:

  * Call `useLoginMutation`.
  * On success, call `setAuth` in Zustand.
  * Redirect to `/employee` or `/admin` based on `role`.
  * On error (401), show an error message under the form (Japanese OK, e.g. “社員番号またはパスワードが正しくありません”).

Make the page visually simple but “business-like” (centered form, small title, etc.).

---

## EmployeeHomePage implementation (placeholder)

In `src/routes/EmployeeHomePage.tsx`:

* Wrap content with `AppLayout`.
* Show:

  * Heading “マイページ”
  * Today’s date (can use `new Date()`; formatting can be simple for now)
  * Placeholder text for “今日の勤怠ステータス”
  * Two MUI buttons:

    * “出勤”
    * “退勤”
* No real API calls yet; buttons can just be disabled or show a Snackbar saying “未実装”.

This page must be accessible only when logged-in and role is `"employee"`.

---

## AdminDashboardPage implementation (placeholder)

In `src/routes/AdminDashboardPage.tsx`:

* Wrap content with `AppLayout`.
* Show:

  * Heading “管理者ダッシュボード”
  * A MUI table with:

    * Header: “社員名 / 出勤時刻 / 退勤時刻 / ステータス”
    * 2〜3 static dummy rows to simulate data
* Later we will replace static rows with React Query calls to mocked `/api/admin/attendance/today`.

This page must be accessible only when logged-in and role is `"admin"`.

---

## Coding style

* Use TypeScript with strict types.
* Prefer functional components and hooks.
* Keep components small and focused.
* Use Japanese labels in the UI (e.g. ボタンラベル、見出し) since the app is for a Japanese company.
* File and symbol names should be clear and domain-oriented: `EmployeeHomePage`, `AdminDashboardPage`, `useAuthStore`, etc.

---

## Task

1. Create or update all files listed above.
2. Ensure the app can be started with `npm run dev` and:

   * `/login` shows a working login form.
   * Logging in as:

     * `loginId: "001", password: "pass"` → redirect to `/employee`.
     * `loginId: "admin", password: "pass"` → redirect to `/admin`.
3. Protect `/employee` and `/admin` so that direct access without login redirects to `/login`.

Please output the **final code for each created/updated file**, grouped by file path, so I can copy-paste them into my project.


