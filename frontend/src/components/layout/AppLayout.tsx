import type { ReactNode } from "react";
import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store";

type AppLayoutProps = {
  title?: string;
  children: ReactNode;
};

export const AppLayout = ({ title = "勤怠管理システム", children }: AppLayoutProps) => {
  const navigate = useNavigate();
  const { name, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    navigate("/login", { replace: true });
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f4f6f8" }}>
      <AppBar position="static" color="primary">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            {name && (
              <Typography variant="body1" component="span">
                {name} さん
              </Typography>
            )}
            <Button color="inherit" onClick={handleLogout}>
              ログアウト
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 4 }}>{children}</Container>
    </Box>
  );
};
