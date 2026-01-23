 "use server";
import { prisma } from "@/app/utils/db";
import { redirect } from "next/navigation";


function parseTimeRange(date: string, timeRange: string) {
  const [startStr, endStr] = timeRange.split(" - ");
  const [startHour, startMin] = startStr.split(":").map(Number);
  const [endHour, endMin] = endStr.split(":").map(Number);

  const startTime = new Date(date);
  startTime.setHours(startHour, startMin, 0, 0);

  const endTime = new Date(date);
  endTime.setHours(endHour, endMin, 0, 0);

  return { startTime, endTime };
}

export async function createBooking(data: {
  name: string;
  email: string;
  phone: string;
  company: string;
  notes?: string;
  consent: boolean;
  trainingType: string;
  selectedDate: string;
  selectedTime: string;
}) {
  "use server";

  const { startTime, endTime } = parseTimeRange(
    data.selectedDate,
    data.selectedTime
  );

  const booking = await prisma.bookingRequest.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      notes: data.notes || "",
      consent: data.consent,
      trainingType: data.trainingType,
      date: new Date(data.selectedDate),
      startTime,
      endTime,
    },
  });

   redirect("/thank-you");
}
