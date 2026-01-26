"use client";

import { useEffect, useState } from "react";
import { ChevronRight, Info, Calendar } from "lucide-react";
import {
  getEmployeeSchedule,
  getEmployeeMonthlyHours,
  getEmployeeProfile,
  getEmployeeCompanies,
} from "./employeeactions";
import EmployeeWeeklyMessages from "./EmployeeMessages";
import SendMessageForm from "./SendMessageForm";
import Link from "next/link";

type Session = {
  id: string;
  date: string;
  time: string;
  topic: string;
  status: string;
};
type DayLog = { date: string; start: string; end: string; minutes: number };
type Company = { companyId: string; companyName: string };

export default function EmployeeDashboard() {
  const [showHoursModal, setShowHoursModal] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [dailyLogs, setDailyLogs] = useState<DayLog[]>([]);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [loadingHours, setLoadingHours] = useState(true);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const result = await getEmployeeCompanies();
        setCompanies(result);
        if (result.length) setSelectedCompany(result[0].companyId);
      } catch (err) {
        console.error(err);
      }
    }
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (!selectedCompany) return;
    getEmployeeProfile()
      .then((emp) => {
        if (!selectedCompany && emp.company?.id)
          setSelectedCompany(emp.company.id);
      })
      .catch(console.error);
  }, [selectedCompany]);

  useEffect(() => {
    if (!selectedCompany) return;
    setLoadingSessions(true);
    getEmployeeSchedule(selectedCompany)
      .then(setSessions)
      .catch(console.error)
      .finally(() => setLoadingSessions(false));
  }, [selectedCompany]);

  useEffect(() => {
    if (!selectedCompany) return;
    setLoadingHours(true);
    getEmployeeMonthlyHours(selectedCompany)
      .then((res) => {
        setDailyLogs(res.daily);
        setTotalMinutes(res.totalMinutes);
      })
      .catch(console.error)
      .finally(() => setLoadingHours(false));
  }, [selectedCompany]);

  const formatMinutes = (mins: number) =>
    `${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, "0")}m`;
  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 mt-20 max-w-7xl mx-auto mb-20">
      <div>
        {/* COMPANY SELECTOR */}
        {companies.length > 1 && (
          <div className="mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-600" />
            <label className="text-teal-900 font-semibold">Company:</label>
            <select
              value={selectedCompany || ""}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="border border-teal-100 p-2"
            >
              {companies.map((c) => (
                <option key={c.companyId} value={c.companyId}>
                  {c.companyName}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* MESSAGES & SEND FORM */}
        {selectedCompany ? (
          <div className="md:col-span-2 bg-white p-4 shadow-lg border border-teal-600 rounded flex flex-col gap-y-6">
            <EmployeeWeeklyMessages companyId={selectedCompany} />
            <SendMessageForm
              key={selectedCompany}
              companyId={selectedCompany}
            />
          </div>
        ) : (
          <p className="text-gray-500">
            Select a company to view messages and send new ones.
          </p>
        )}

        {/* SESSIONS */}
        {loadingSessions && (
          <p className="text-sm text-gray-400 mt-4">Loading schedule...</p>
        )}
        {!loadingSessions && sessions.length === 0 && (
          <p className="text-sm text-gray-400 mt-4">No upcoming sessions.</p>
        )}
        <ul className="space-y-3 mt-4">
          {sessions.map((s) => (
            <li
              key={s.id}
              className="grid grid-cols-2 p-3 rounded-md hover:bg-teal-50 shadow"
            >
              <div>
                <p className="text-sm text-gray-500">{s.date}</p>
                <p className="font-medium">{s.topic}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-teal-600 font-semibold">
                  {s.status}
                </p>
                <p className="text-sm text-gray-500">{s.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* RIGHT COLUMN */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="flex justify-end sm:justify-start">
          <Link
            href="/employee/schedule"
            className="text-teal-100 bg-teal-900 hover:bg-teal-700 px-4 py-2 text-[12px] font-semibold uppercase rounded-xs border border-teal-200 transition flex items-center gap-2 w-40 h-8 mt-4"
          >
            Show Schedule <span>➠</span>
          </Link>
        </div>

        <button
          onClick={() => setShowHoursModal(true)}
          className="relative h-16 grid grid-cols-2 items-center bg-teal-300 rounded-md hover:bg-teal-200 shadow px-2"
        >
          <span className="text-xs font-medium text-gray-700">
            Hours Worked This Month
          </span>
          <span className="flex justify-end gap-1 text-teal-800 font-semibold">
            {loadingHours ? "…" : formatMinutes(totalMinutes)}
          </span>
          <Info className="absolute top-2 right-2 w-4 h-4 text-teal-700" />
        </button>
      </div>

      {/* HOURS MODAL */}
      {showHoursModal && (
        <div className="fixed inset-0 bg-black/50 grid place-items-center z-50 border border-teal-100">
          <div className="bg-white p-6 rounded-md w-11/12 md:w-1/2 max-h-[80vh] overflow-y-auto">
            <div className="bg-teal-800 p-4 rounded-md mb-4">
              <h2 className="text-xl font-semibold mb-2 text-white">
                Hours Worked
              </h2>
              <p className="text-teal-100">
                Total so far: {formatMinutes(totalMinutes)}
              </p>
            </div>

            <table className="w-full text-left border-collapse">
              <thead className="border-b border-teal-100 bg-teal-400 px-2">
                <tr>
                  <th className="py-2 pl-2">Date</th>
                  <th className="py-2">Start – End</th>
                  <th className="py-2">Duration</th>
                </tr>
              </thead>
              <tbody>
                {dailyLogs.map((log, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-teal-100 hover:bg-teal-50"
                  >
                    <td className="py-2">{formatDate(log.date)}</td>
                    <td className="py-2">
                      {formatTime(log.start)} – {formatTime(log.end)}
                    </td>
                    <td className="py-2">{formatMinutes(log.minutes)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              onClick={() => setShowHoursModal(false)}
              className="mt-4 ml-auto block bg-teal-800 text-white px-4 py-1 rounded-md hover:bg-teal-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
