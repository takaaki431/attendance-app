import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { isAxiosError } from "axios";
import { AppLayout } from "../components/layout/AppLayout";
import {
  useClockInMutation,
  useClockOutMutation,
  useTodayAttendanceQuery,
} from "../features/attendance/hooks";
import type { AttendanceRecord, AttendanceStatus } from "../features/attendance/types";

const statusLabel: Record<AttendanceStatus, string> = {
  not_started: "未出勤",
  working: "勤務中",
  completed: "退勤済み",
};

const formatTime = (value?: string) => {
  if (!value) return "--:--";
  return new Date(value).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });
};

const extractErrorMessage = (error: unknown) => {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? error.message;
  }
  return "エラーが発生しました";
};

const EmployeeHomePage = () => {
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const today = useMemo(
    () =>
      new Date().toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      }),
    [],
  );

  const attendanceQuery = useTodayAttendanceQuery();
  const clockInMutation = useClockInMutation();
  const clockOutMutation = useClockOutMutation();

  const attendance: AttendanceRecord = attendanceQuery.data ?? { status: "not_started" };

  const handleClockIn = async () => {
    try {
      await clockInMutation.mutateAsync();
      setSnackbarMessage("出勤打刻しました");
    } catch (error) {
      console.error("clock-in failed", error);
    }
  };

  const handleClockOut = async () => {
    try {
      await clockOutMutation.mutateAsync();
      setSnackbarMessage("退勤打刻しました");
    } catch (error) {
      console.error("clock-out failed", error);
    }
  };

  const isLoading = attendanceQuery.isLoading || clockInMutation.isPending || clockOutMutation.isPending;
  const clockInDisabled =
    isLoading || attendance.status !== "not_started" || attendanceQuery.isError;
  const clockOutDisabled =
    isLoading || attendance.status !== "working" || attendanceQuery.isError;

  const queryErrorMessage = attendanceQuery.isError
    ? extractErrorMessage(attendanceQuery.error)
    : null;
  const mutationError =
    clockInMutation.error ?? clockOutMutation.error ?? null;
  const mutationErrorMessage = mutationError ? extractErrorMessage(mutationError) : null;

  return (
    <AppLayout>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            マイページ
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            本日: {today}
          </Typography>
        </Box>

        {queryErrorMessage && (
          <Alert severity="error" data-testid="attendance-load-error">
            {queryErrorMessage}
          </Alert>
        )}

        {mutationErrorMessage && (
          <Alert severity="error" data-testid="attendance-action-error">
            {mutationErrorMessage}
          </Alert>
        )}

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              今日の勤怠ステータス
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              {attendanceQuery.isLoading ? "読み込み中..." : statusLabel[attendance.status]}
            </Typography>
            <Stack direction="row" spacing={3} sx={{ color: "text.secondary" }}>
              <Typography>出勤: {formatTime(attendance.clockInAt)}</Typography>
              <Typography>退勤: {formatTime(attendance.clockOutAt)}</Typography>
            </Stack>
          </CardContent>
        </Card>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClockIn}
            disabled={clockInDisabled}
          >
            {clockInMutation.isPending ? "処理中..." : "出勤"}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleClockOut}
            disabled={clockOutDisabled}
          >
            {clockOutMutation.isPending ? "処理中..." : "退勤"}
          </Button>
        </Stack>
      </Stack>

      <Snackbar
        open={Boolean(snackbarMessage)}
        autoHideDuration={3000}
        onClose={() => setSnackbarMessage(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          sx={{ width: "100%" }}
          onClose={() => setSnackbarMessage(null)}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </AppLayout>
  );
};

export default EmployeeHomePage;
