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
  LabelList,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Users, Clock, Wallet, TrendingUp } from "lucide-react";
import { getCompanyAnalysis, getAvailableMonths } from "./analysisactions";
import { format } from "date-fns";

// Helper function to format hours as "Xh Ym"
function formatHours(hoursFloat: number) {
  const hours = Math.floor(hoursFloat);
  const minutes = Math.round((hoursFloat - hours) * 60);
  return `${hours}h ${minutes}m`;
}

export default function CompanyAnalysisClient({
  companyId,
}: {
  companyId: string;
}) {
  const [availableMonths, setAvailableMonths] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [dailyData, setDailyData] = useState<
    { day: number; hours: number; tips: number }[]
  >([]);
  const [salaryData, setSalaryData] = useState<
    { name: string; hours: number; salary: number }[]
  >([]);
  const [employeesCount, setEmployeesCount] = useState(0);

  // Fetch available months
  useEffect(() => {
    async function fetchMonths() {
      const months = await getAvailableMonths(companyId);
      const formatted = months.map((m) => {
        const [year, month] = m.split("-");
        const date = new Date(Number(year), Number(month) - 1);
        return { value: m, label: format(date, "MMMM yyyy") };
      });
      setAvailableMonths(formatted);
      if (!selectedMonth && formatted.length)
        setSelectedMonth(formatted[0].value);
    }
    fetchMonths();
  }, [companyId]);

  // Fetch analysis data for the selected month
  useEffect(() => {
    if (!selectedMonth) return;
    async function fetchData() {
      const data = await getCompanyAnalysis({
        companyId,
        month: selectedMonth,
      });
      setDailyData(data.dailyData);
      setSalaryData(data.salaryData);
      setEmployeesCount(data.employeesCount);
    }
    fetchData();
  }, [selectedMonth, companyId]);

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
          {availableMonths.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPI icon={Users} label="Employees" value={employeesCount} />
        <KPI
          icon={Clock}
          label="Worked Hours"
          value={formatHours(totalHours)}
        />
        <KPI
          icon={Wallet}
          label="Salary Cost"
          value={`${totalSalary.toFixed(0)} SEK`}
        />
        <KPI
          icon={TrendingUp}
          label="Total Tips"
          value={`${totalTips.toFixed(0)} SEK`}
        />
      </div>

      {/* TABS */}
      <Tabs defaultValue="hours">
        <TabsList>
          <TabsTrigger value="hours">Worked Hours</TabsTrigger>
          <TabsTrigger value="salary">Salary</TabsTrigger>
          <TabsTrigger value="tips">Tips</TabsTrigger>
        </TabsList>

        {/* Worked Hours Chart */}
        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle>Daily Worked Hours</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis tickFormatter={(value) => formatHours(value)} />
                  <Tooltip formatter={(value: number) => formatHours(value)} />
                  <Bar dataKey="hours" fill="#0d9488">
                    <LabelList
                      dataKey="hours"
                      formatter={(label) => {
                        if (typeof label === "number")
                          return formatHours(label);
                        return "";
                      }}
                      position="top"
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Salary Chart */}
        <TabsContent value="salary">
          <Card>
            <CardHeader>
              <CardTitle>Salary per Employee</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salaryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => `${value.toFixed(0)} SEK`}
                  />
                  <Bar dataKey="salary" fill="#0d9488" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tips Chart */}
        <TabsContent value="tips">
          <Card>
            <CardHeader>
              <CardTitle>Daily Tips</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => `${value.toFixed(0)} SEK`}
                  />
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

// KPI Component
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
