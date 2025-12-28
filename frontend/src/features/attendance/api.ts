import { axiosClient } from "../../lib/axiosClient";
import type { AttendanceRecord } from "./types";

export const getTodayAttendance = async (): Promise<AttendanceRecord> => {
  const response = await axiosClient.get<AttendanceRecord>("/attendance/today");
  return response.data;
};

export const clockIn = async (): Promise<AttendanceRecord> => {
  const response = await axiosClient.post<AttendanceRecord>("/attendance/clock-in");
  return response.data;
};

export const clockOut = async (): Promise<AttendanceRecord> => {
  const response = await axiosClient.post<AttendanceRecord>("/attendance/clock-out");
  return response.data;
};
