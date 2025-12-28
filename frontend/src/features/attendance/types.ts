export type AttendanceStatus = "not_started" | "working" | "completed";

export type AttendanceRecord = {
  status: AttendanceStatus;
  clockInAt?: string;
  clockOutAt?: string;
};
