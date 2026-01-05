// utils/formatDate.ts
export function formatDate(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toISOString().slice(0, 10); // YYYY-MM-DD format
}

export function formatTime(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toTimeString().slice(0, 5); // HH:MM format
}
