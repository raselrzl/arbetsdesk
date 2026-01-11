// ClientDate.tsx
"use client";

export default function ClientDate({ date }: { date: string }) {
  const d = new Date(date);
  return <span>{d.toLocaleString("en-GB")}</span>;
}
