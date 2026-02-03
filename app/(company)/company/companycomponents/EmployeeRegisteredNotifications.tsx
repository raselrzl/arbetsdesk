import ClientDate from "./ClientDate";

export default function EmployeeRegisteredNotifications({
  notifications,
}: {
  notifications?: any[];
}) {
  // If nothing to show, render nothing
  if (!notifications || notifications.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {notifications.map((n) => (
        <div
          key={n.id}
          className="p-3 shadow rounded-md border-l-6 bg-white border-amber-400"
        >
          <p className="text-gray-700"> {n.body}</p>
          <div className="text-[9px] text-gray-800 mt-1 flex justify-end">
            <div className="bg-amber-300 px-1 py-px rounded-xs text-gray-500">
              <ClientDate date={n.createdAt} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
