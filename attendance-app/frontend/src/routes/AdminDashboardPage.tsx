import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { AppLayout } from "../components/layout/AppLayout";

const dummyRows = [
  { name: "田中太郎", clockIn: "09:00", clockOut: "--:--", status: "出勤中" },
  { name: "佐藤花子", clockIn: "08:45", clockOut: "17:30", status: "退勤済み" },
  { name: "鈴木一郎", clockIn: "--:--", clockOut: "--:--", status: "未出勤" },
];

const AdminDashboardPage = () => {
  return (
    <AppLayout>
      <Stack spacing={3}>
        <Typography variant="h4">管理者ダッシュボード</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>社員名</TableCell>
                <TableCell>出勤時刻</TableCell>
                <TableCell>退勤時刻</TableCell>
                <TableCell>ステータス</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dummyRows.map((row) => (
                <TableRow key={row.name}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.clockIn}</TableCell>
                  <TableCell>{row.clockOut}</TableCell>
                  <TableCell>{row.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </AppLayout>
  );
};

export default AdminDashboardPage;
