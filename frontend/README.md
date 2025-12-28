# attendance-app frontend

勤怠管理ポートフォリオのフロントエンド (React + TypeScript + Vite)。msw でモック API を立て、ログイン〜ロール別ダッシュボード、出勤/退勤の UI まで体験できます。

## セットアップ

```bash
cd frontend
npm install
npm run dev
```

開発サーバー: http://localhost:5173  
`npm run dev` で msw が自動起動します。

## ログイン情報（モック）

- 社員: `loginId: 001`, `password: pass` → `/employee`
- 管理者: `loginId: admin`, `password: pass` → `/admin`

## 画面と機能

- `/login`: RHF + zod でバリデーション。msw 経由で `/api/login` を呼び、Zustand にトークン/ユーザー情報を保存。ロールに応じてリダイレクト。
- `/employee`: マイページ。今日の勤怠ステータスを取得して表示。出勤/退勤ボタンでモック API (`/attendance/clock-in`, `/attendance/clock-out`) を呼び、React Query のキャッシュを更新。
- `/admin`: 管理者ダッシュボードのプレースホルダー。ダミーの当日勤怠テーブル表示。
- 未ログインまたは権限違いは `/login` にリダイレクト。

## 技術スタック

- React 18, TypeScript, Vite
- Zustand（認証状態）
- TanStack React Query（データフェッチ）
- React Router
- MUI
- React Hook Form + zod
- axios
- msw（モック API）
