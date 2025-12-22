import { useEffect, useMemo } from "react";
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { useLoginMutation } from "../features/auth/hooks";
import { useAuthStore } from "../features/auth/store";

const loginSchema = z.object({
  loginId: z.string().min(1, "社員番号を入力してください"),
  password: z.string().min(1, "パスワードを入力してください"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const { role, token, setAuth } = useAuthStore();
  const loginMutation = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { loginId: "", password: "" },
  });

  useEffect(() => {
    if (token && role) {
      const nextPath = role === "employee" ? "/employee" : "/admin";
      navigate(nextPath, { replace: true });
    }
  }, [navigate, role, token]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      const result = await loginMutation.mutateAsync(values);
      setAuth(result);
      const nextPath = result.role === "employee" ? "/employee" : "/admin";
      navigate(nextPath, { replace: true });
    } catch (error) {
      // エラーハンドリングはmutationの状態を表示する
      console.error("Login failed", error);
    }
  });

  const errorMessage = useMemo(() => {
    if (!loginMutation.error) return null;
    if (isAxiosError<{ message?: string }>(loginMutation.error)) {
      return loginMutation.error.response?.data?.message ?? "ログインに失敗しました";
    }
    return "ログインに失敗しました";
  }, [loginMutation.error]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f0f2f5",
        px: 2,
      }}
    >
      <Paper elevation={3} sx={{ maxWidth: 420, width: "100%", p: 4 }}>
        <Stack spacing={3}>
          <Typography variant="h5" component="h1" textAlign="center">
            勤怠管理システム ログイン
          </Typography>
          <Stack spacing={2} component="form" onSubmit={onSubmit}>
            <TextField
              label="社員番号"
              fullWidth
              {...register("loginId")}
              error={Boolean(errors.loginId)}
              helperText={errors.loginId?.message}
              autoComplete="username"
            />
            <TextField
              label="パスワード"
              type="password"
              fullWidth
              {...register("password")}
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
              autoComplete="current-password"
            />
            {errorMessage && (
              <Alert severity="error" data-testid="login-error">
                {errorMessage}
              </Alert>
            )}
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "処理中..." : "ログイン"}
            </Button>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              デモ用: 社員番号「001」または「admin」、パスワード「pass」
            </Typography>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
};

export default LoginPage;
