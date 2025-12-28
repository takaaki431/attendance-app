import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clockIn, clockOut, getTodayAttendance } from "./api";

const ATTENDANCE_QUERY_KEY = ["attendance", "today"] as const;

export const useTodayAttendanceQuery = () => {
  return useQuery({
    queryKey: ATTENDANCE_QUERY_KEY,
    queryFn: () => getTodayAttendance(),
    staleTime: 1000 * 60,
  });
};

export const useClockInMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => clockIn(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ATTENDANCE_QUERY_KEY });
    },
  });
};

export const useClockOutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => clockOut(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ATTENDANCE_QUERY_KEY });
    },
  });
};
