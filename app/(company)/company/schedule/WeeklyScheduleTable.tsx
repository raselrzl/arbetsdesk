"use client";

type Props = {
  schedules: any[];
  employees: { id: string; name: string }[];
};

/* ---------------- HELPERS ---------------- */

function getCurrentWeekRange() {
  const now = new Date();
  const day = now.getDay(); // 0 = Sun
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const start = new Date(now);
  start.setDate(now.getDate() + diffToMonday);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

/* ---------------- COMPONENT ---------------- */

export default function WeeklyScheduleTable({
  schedules,
  employees,
}: Props) {
  const { start, end } = getCurrentWeekRange();

  /* Filter current week only */
  const weekSchedules = schedules.filter((sch) => {
    const d = new Date(sch.date);
    return d >= start && d <= end;
  });

  /* Build week days (Mon–Sun) */
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });

  /* Group schedules by day */
  const schedulesByDay: Record<string, any[]> = {};
  daysOfWeek.forEach((d) => {
    schedulesByDay[d.toDateString()] = [];
  });

  weekSchedules.forEach((sch) => {
    const key = new Date(sch.date).toDateString();
    if (schedulesByDay[key]) {
      schedulesByDay[key].push(sch);
    }
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        {/* HEADER */}
        <thead>
          <tr className="bg-teal-100">
            <th className="p-3 border text-left">Schedule</th>
            {daysOfWeek.map((day) => (
              <th key={day.toDateString()} className="p-3 border text-center">
                {day.toLocaleDateString(undefined, { weekday: "short" })}
                <p className="text-xs text-gray-600">
                  {day.toLocaleDateString()}
                </p>
              </th>
            ))}
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id} className="border-t">
              {/* LEFT COLUMN */}
              <td className="p-3 border font-medium">
                {emp.name}
              </td>

              {/* DAYS */}
              {daysOfWeek.map((day) => {
                const dayKey = day.toDateString();
                const empSchedules =
                  schedulesByDay[dayKey]?.filter(
                    (s) => s.employee.id === emp.id
                  ) || [];

                return (
                  <td key={dayKey} className="p-3 border text-xs">
                    {empSchedules.length === 0 ? (
                      <span className="text-gray-400">—</span>
                    ) : (
                      empSchedules.map((sch) => (
                        <div key={sch.id}>
                          {new Date(sch.startTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          –{" "}
                          {new Date(sch.endTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      ))
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
