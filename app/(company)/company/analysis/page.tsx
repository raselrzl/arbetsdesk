"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Users, Clock, Wallet, TrendingUp } from "lucide-react";

// ------------------
// MOCK DATA
// ------------------
const employees = [
  "Anna Karlsson",
  "Erik Svensson",
  "Johan Nilsson",
  "Maria Andersson",
  "Sara Johansson",
];

const months = [
  { label: "January 2025", value: "2025-01" },
  { label: "February 2025", value: "2025-02" },
  { label: "March 2025", value: "2025-03" },
  { label: "April 2025", value: "2025-04" },
];

const HOURLY_RATE = 180;

// ------------------
// TYPES
// ------------------
type DailyRecord = {
  day: number;
  hours: number;
  tips: number;
};

// ------------------
// PAGE
// ------------------
export default function CompanyAnalysisPage() {
  const [selectedMonth, setSelectedMonth] = useState("2025-01");
  const [dailyData, setDailyData] = useState<DailyRecord[]>([]);
  const [salaryData, setSalaryData] = useState<any[]>([]);

  // ------------------
  // Simulate DB fetch
  // ------------------
  useEffect(() => {
    const daysInMonth = 30;

    // DAILY TIME & TIPS
    const generatedDailyData: DailyRecord[] = Array.from(
      { length: daysInMonth },
      (_, i) => ({
        day: i + 1,
        hours: Math.random() > 0.2 ? 20 + Math.floor(Math.random() * 40) : 0,
        tips: Math.random() > 0.3 ? 200 + Math.floor(Math.random() * 600) : 0,
      })
    );

    setDailyData(generatedDailyData);

    // SALARY PER EMPLOYEE
    setSalaryData(
      employees.map((name) => {
        const hours = 120 + Math.floor(Math.random() * 40);
        return {
          name,
          hours,
          salary: hours * HOURLY_RATE,
        };
      })
    );
  }, [selectedMonth]);

  // ------------------
  // TOTALS
  // ------------------
  const totalHours = useMemo(
    () => dailyData.reduce((sum, d) => sum + d.hours, 0),
    [dailyData]
  );

  const totalTips = useMemo(
    () => dailyData.reduce((sum, d) => sum + d.tips, 0),
    [dailyData]
  );

  const totalSalary = useMemo(
    () => salaryData.reduce((sum, s) => sum + s.salary, 0),
    [salaryData]
  );

  return (
    <div className="p-6 mt-20 max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Company Analysis</h1>
          <p className="text-gray-500">
            Daily-based time, salary & tips overview
          </p>
        </div>

        {/* MONTH FILTER */}
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border rounded px-3 py-2"
        >
          {months.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPI icon={Users} label="Employees" value={employees.length} />
        <KPI icon={Clock} label="Worked Hours" value={`${totalHours}h`} />
        <KPI icon={Wallet} label="Salary Cost" value={`${totalSalary} SEK`} />
        <KPI icon={TrendingUp} label="Total Tips" value={`${totalTips} SEK`} />
      </div>

      {/* TABS */}
      <Tabs defaultValue="hours">
        <TabsList>
          <TabsTrigger value="hours">Worked Hours</TabsTrigger>
          <TabsTrigger value="salary">Salary</TabsTrigger>
          <TabsTrigger value="tips">Tips</TabsTrigger>
        </TabsList>

        {/* HOURS PER DAY */}
        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle>Daily Worked Hours</CardTitle>
            </CardHeader>
            <CardContent className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="hours" fill="#0d9488" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SALARY PER EMPLOYEE */}
        <TabsContent value="salary">
          <Card>
            <CardHeader>
              <CardTitle>Salary per Employee</CardTitle>
            </CardHeader>
            <CardContent className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salaryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="salary" fill="#0d9488" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TIPS PER DAY */}
        <TabsContent value="tips">
          <Card>
            <CardHeader>
              <CardTitle>Daily Tips</CardTitle>
            </CardHeader>
            <CardContent className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="tips" fill="#facc15" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ------------------
// KPI COMPONENT
// ------------------
function KPI({ icon: Icon, label, value }: any) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <Icon className="w-6 h-6 text-teal-600" />
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
