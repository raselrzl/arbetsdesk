"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

import {
  loginUserAction,
  loginCompanyAction,
  loginEmployeeAction,
} from "../actions";
import { HomeLoginButton } from "./HomeLoginButton";

type Tab = "USER" | "COMPANY" | "EMPLOYEE";

export default function LoginForm() {
  const search = useSearchParams();
  const [tab, setTab] = useState<Tab>("USER");

  // shared
  const [personalNumber, setPersonalNumber] = useState("");

  // user pin
  const [pinDigits, setPinDigits] = useState(["", "", "", ""]);
  const pinRefs = Array.from({ length: 4 }, () =>
    useRef<HTMLInputElement>(null)
  );
  const pinNumber = pinDigits.join("");

  // company
  const [organizationNo, setOrganizationNo] = useState("");
  const [loginCode, setLoginCode] = useState("");

  // employee
  const [pinCode, setPinCode] = useState("");

  useEffect(() => {
    if (search.get("error")) {
      alert("Invalid login credentials");
    }
  }, [search]);

  const handlePinChange = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...pinDigits];
    next[i] = v;
    setPinDigits(next);
    if (v && i < 3) pinRefs[i + 1].current?.focus();
    if (!v && i > 0) pinRefs[i - 1].current?.focus();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md bg-teal-700 p-8 shadow-md rounded-md">
        <h1 className="text-4xl font-extrabold uppercase mb-6 text-center text-white">
          Login
        </h1>

        {/* TABS */}
        <div className="flex mb-6 rounded overflow-hidden">
          {(["USER", "COMPANY", "EMPLOYEE"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 text-sm font-bold ${
                tab === t
                  ? "bg-teal-900 text-white"
                  : "bg-teal-600 text-teal-100"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ================= USER LOGIN ================= */}
        {tab === "USER" && (
          <form action={loginUserAction} className="grid gap-6">
            <div>
              <Label className="text-white">Personal Number</Label>
              <Input
                name="personalNumber"
                value={personalNumber}
                onChange={(e) => setPersonalNumber(e.target.value)}
                className="bg-white text-black"
              />
            </div>

            <div>
              <Label className="text-white">PIN</Label>
              <div className="flex gap-2 justify-center mt-1">
                {pinDigits.map((d, i) => (
                  <Input
                    key={i}
                    ref={pinRefs[i]}
                    value={d}
                    maxLength={1}
                    onChange={(e) => handlePinChange(i, e.target.value)}
                    className="w-12 h-12 text-center bg-white text-black"
                  />
                ))}
              </div>
              <input type="hidden" name="pinNumber" value={pinNumber} />
            </div>

            <Button className="bg-teal-900">
              Login <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>
        )}

        {/* ================= COMPANY LOGIN ================= */}
        {tab === "COMPANY" && (
          <form action={loginCompanyAction} className="grid gap-6">
            <div>
              <Label className="text-white">Organization Number</Label>
              <Input
                name="organizationNo"
                value={organizationNo}
                onChange={(e) => setOrganizationNo(e.target.value)}
                className="bg-white text-black"
              />
            </div>

            <div>
              <Label className="text-white">Login Code</Label>
              <Input
                name="loginCode"
                value={loginCode}
                onChange={(e) => setLoginCode(e.target.value)}
                className="bg-white text-black"
              />
            </div>

            <HomeLoginButton />
          </form>
        )}

        {/* ================= EMPLOYEE LOGIN ================= */}
        {tab === "EMPLOYEE" && (
          <form action={loginEmployeeAction} className="grid gap-6">
            <div>
              <Label className="text-white">Personal Number</Label>
              <Input
                name="personalNumber"
                value={personalNumber}
                onChange={(e) => setPersonalNumber(e.target.value)}
                className="bg-white text-black"
              />
            </div>

            <div>
              <Label className="text-white">PIN Code</Label>
              <Input
                name="pinCode"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                className="bg-white text-black"
              />
            </div>

            <HomeLoginButton />
          </form>
        )}
      </div>

      <div className="w-full max-w-md p-2 mt-6 text-sm text-gray-600 text-center bg-teal-50 rounded-lg">
        One login for User, Company & Employee
      </div>
    </div>
  );
}
