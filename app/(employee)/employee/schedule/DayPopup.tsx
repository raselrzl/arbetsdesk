
type DailySchedule = {
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
};

export default function DayPopup({
  dateKey,
  schedules,
  onClose,
}: {
  dateKey: string;
  schedules: DailySchedule[];
  onClose: () => void;
}) {
  const dateObj = new Date(dateKey);
  const dayName = dateObj.toLocaleDateString("en-GB", { weekday: "long" });

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-4 min-w-[280px] border border-teal-200">
        <div className="flex justify-between items-center mb-2">
          <div className="font-semibold text-teal-900">
            {dayName}, {dateKey}
          </div>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>

        {schedules.length ? (
          schedules.map((s, i) => (
            <div key={i} className="text-sm text-teal-700">
              {new Date(s.startTime).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              –{" "}
              {new Date(s.endTime).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-400">No schedule</div>
        )}
      </div>
    </div>
  );
}
