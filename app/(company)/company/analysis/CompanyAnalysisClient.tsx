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
import { Users, Clock, Wallet, TrendingUp, PlusCircle } from "lucide-react";
import {
  getCompanyAnalysis,
  getAvailableMonths,
  getMonthlyProfitability,
} from "./analysisactions";
import { format } from "date-fns";
import MonthlyProfitTable from "./MonthlyProfitTable";
import Link from "next/link";

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
  const [profitRows, setProfitRows] = useState<any[]>([]);

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

  useEffect(() => {
    if (!selectedMonth) return;

    async function fetchProfitability() {
      const result = await getMonthlyProfitability(companyId, selectedMonth);
      setProfitRows(result.rows);
    }

    fetchProfitability();
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

  const totalSales = useMemo(() => {
    return profitRows.reduce((sum, row) => {
      const cash = Number(row.salesBreakdown?.cash || 0);
      const card = Number(row.salesBreakdown?.card || 0);
      return sum + cash + card;
    }, 0);
  }, [profitRows]);

  const totalAdditionalCost = useMemo(() => {
    return profitRows.reduce((sum, row) => {
      const dailyCost = Object.values(
        row.costBreakdown?.categories || {}
      ).reduce((s: number, v: any) => s + Number(v), 0);
      return sum + dailyCost;
    }, 0);
  }, [profitRows]);

  const netProfit = useMemo(() => {
    return totalSales - totalSalary - totalAdditionalCost;
  }, [totalSales, totalSalary, totalAdditionalCost]);

  return (
    <div className="p-2 sm:p-6 mt-20 max-w-7xl mx-auto space-y-6 mb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        {/* ACTION LINKS */}
        <div className="flex gap-3">
          <Link
            href="/company/additionalcost"
            className="text-teal-900 px-4 py-1 text-[14px] font-semibold uppercase rounded-xs border border-teal-200  hover:bg-teal-200 transition flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" /> Add Cost
          </Link>

          <Link
            href="/company/sales"
            className="text-teal-900 px-4 py-1 text-[14px] font-semibold uppercase rounded-xs border border-teal-200  hover:bg-teal-200 transition flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" /> Add Sales
          </Link>
        </div>

        {/* MONTH FILTER */}
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border border-teal-100 rounded-xs px-3 py-1"
        >
          {availableMonths.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      <MonthlyProfitTable companyId={companyId} month={selectedMonth} />

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border border-teal-100 shadow-lg shadow-teal-800 p-4 my-12">
        <KPI
          imageSrc="/icons/10.png"
          label="Employees"
          value={employeesCount}
        />
        <KPI
          imageSrc="/icons/1.png"
          label="Worked Hours"
          value={formatHours(totalHours)}
        />
        <KPI
          imageSrc="/icons/13.png"
          label="Salary Cost"
          value={`${totalSalary.toFixed(0)} `}
        />
        <KPI
          imageSrc="/icons/4.png"
          label="Total Tips"
          value={`${totalTips.toFixed(0)} `}
        />

        <KPI
          imageSrc="/icons/6.png"
          label="Total Sales"
          value={`${totalSales.toFixed(0)} `}
        />

        <KPI
          imageSrc="/icons/8.png"
          label="Additional Costs"
          value={`${totalAdditionalCost.toFixed(0)} `}
        />

        <KPI
          imageSrc={netProfit >= 0 ? "/icons/9.png" : "/icons/12.png"}
          label={netProfit >= 0 ? "Net Profit" : "Net Loss"}
          value={`${Math.abs(netProfit).toFixed(0)} `}
        />
      </div>

      {/* TABS */}
      <Tabs defaultValue="hours" className="border border-teal-100 shadow-lg shadow-teal-800">
        <TabsList className="rounded-xs bg-teal-200 text-gray-100 flex flex-wrap mb-8 h-auto m-4">
          <TabsTrigger value="hours" className="rounded-xs">
            Worked Hours
          </TabsTrigger>
          <TabsTrigger value="salary" className="rounded-xs">
            Salary
          </TabsTrigger>
          <TabsTrigger value="tips" className="rounded-xs">
            Tips
          </TabsTrigger>
          <TabsTrigger value="monthly-sales" className="rounded-xs">
            Monthly Sales
          </TabsTrigger>

          <TabsTrigger value="monthly-costs" className="rounded-xs">
            Monthly Costs
          </TabsTrigger>
        </TabsList>

        {/* Worked Hours Chart */}
        <TabsContent value="hours">
          <Card className="rounded-xs shadow-teal-100 border-teal-100">
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
                      formatter={(label) =>
                        typeof label === "number" ? formatHours(label) : ""
                      }
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
          <Card className="rounded-xs shadow-teal-100 border-teal-100">
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
                    formatter={(value: number) => `${value.toFixed(0)} `}
                  />
                  <Bar dataKey="salary" fill="#0d9488" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tips Chart */}
        <TabsContent value="tips">
          <Card className="rounded-xs shadow-teal-100 border-teal-100">
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
                    formatter={(value: number) => `${value.toFixed(0)} `}
                  />
                  <Bar dataKey="tips" fill="#facc15" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly-sales">
          <Card className="rounded-xs shadow-teal-100 border-teal-100">
            <CardHeader>
              <CardTitle>Daily Sales (Cash & Card)</CardTitle>
            </CardHeader>

            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={profitRows}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />

                  <Bar
                    dataKey="salesBreakdown.cash"
                    name="Cash"
                    fill="#22c55e"
                  />
                  <Bar
                    dataKey="salesBreakdown.card"
                    name="Card"
                    fill="#3b82f6"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="monthly-costs">
          <Card className="rounded-xs shadow-teal-100 border-teal-100">
            <CardHeader>
              <CardTitle>Daily Additional Costs</CardTitle>
            </CardHeader>

            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={profitRows.map((row) => ({
                    date: row.date,
                    additionalCost: Object.values(
                      row.costBreakdown.categories || {}
                    ).reduce((sum: number, v: any) => sum + Number(v), 0),
                    categories: row.costBreakdown.categories || {},
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;

                      const data = payload[0].payload;
                      const categories = data.categories || {};

                      return (
                        <div className="bg-white border rounded-xs p-3 shadow text-sm">
                          <p className="font-semibold mb-1">Additional Costs</p>

                          {Object.entries(categories).map(([name, value]) => (
                            <div
                              key={name}
                              className="flex justify-between gap-4"
                            >
                              <span>{name}</span>
                              <span className="font-medium">
                                {Number(value).toFixed(0)}
                              </span>
                            </div>
                          ))}

                          <div className="border-t mt-2 pt-1 flex justify-between font-semibold">
                            <span>Total</span>
                            <span>{data.additionalCost.toFixed(0)}</span>
                          </div>
                        </div>
                      );
                    }}
                  />

                  <Bar
                    dataKey="additionalCost"
                    name="Additional Cost"
                    fill="#ef4444"
                  />
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
function KPI({ icon: Icon, imageSrc, label, value }: any) {
  return (
    <Card className="rounded-xs border-teal-100">
      <CardContent className="flex items-center gap-3 p-4">
        {/* Show image if provided, else use icon */}
        {imageSrc ? (
          <img src={imageSrc} alt={label} className="w-6 h-6" />
        ) : (
          <Icon className="w-6 h-6 text-teal-600" />
        )}

        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
