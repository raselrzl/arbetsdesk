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
      <h3 className="text-lg font-semibold text-green-900">
        New Employees
      </h3>

      {notifications.map((n) => (
        <div
          key={n.id}
          className="bg-white border border-green-200 rounded p-3"
        >
          <p className="font-medium">{n.title}</p>

          <p className="text-sm text-gray-600">
            {n.body}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            {new Date(n.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
