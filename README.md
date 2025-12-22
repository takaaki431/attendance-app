# attendance-app

フロントエンド（Vite + React + TypeScript）で勤怠管理のポートフォリオ用UIを実装しています。社員（employee）と管理者（admin）の2ロールを想定し、ログインからロール別ダッシュボードまでの流れをモックAPIで体験できます。

## セットアップ

```bash
cd attendance-app/frontend
npm install
npm run dev
```

開発サーバー: http://localhost:5173  
モックAPIは msw を利用しています。`npm run dev` で自動起動します。

## ログイン情報（モック）

- 社員: 社員番号 `001` / パスワード `pass` → `/employee` に遷移
- 管理者: 社員番号 `admin` / パスワード `pass` → `/admin` に遷移

## 画面概要

- `/login`: RHF + zod でバリデーション、msw 経由で `/api/login` を呼び出し、Zustand に認証状態を保存
- `/employee`: 「マイページ」プレースホルダー。今日の日付と勤怠ステータス枠、出勤・退勤ボタン（未実装通知）
- `/admin`: 「管理者ダッシュボード」プレースホルダー。社員名/出勤時刻/退勤時刻/ステータスのダミーテーブル
- 未ログインまたは権限違いのアクセスは `/login` にリダイレクト

## 技術スタック

- React 18 + TypeScript, Vite
- Zustand（認証状態管理）
- TanStack React Query（API呼び出し）
- React Router（ルーティング）
- MUI（UIコンポーネント）
- React Hook Form + zod（フォーム + バリデーション）
- axios（APIクライアント）
- msw（モックAPI: `/api/login`）

