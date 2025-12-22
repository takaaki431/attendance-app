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
import { AppLayout } from "../components/layout/AppLayout";

const EmployeeHomePage = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
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

  const handlePlaceholderAction = () => {
    setSnackbarOpen(true);
  };

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

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              今日の勤怠ステータス
            </Typography>
            <Typography color="text.secondary">未設定</Typography>
          </CardContent>
        </Card>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Button variant="contained" color="primary" onClick={handlePlaceholderAction}>
            出勤
          </Button>
          <Button variant="outlined" color="primary" onClick={handlePlaceholderAction}>
            退勤
          </Button>
        </Stack>
      </Stack>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="info" sx={{ width: "100%" }} onClose={() => setSnackbarOpen(false)}>
          機能は未実装です
        </Alert>
      </Snackbar>
    </AppLayout>
  );
};

export default EmployeeHomePage;
