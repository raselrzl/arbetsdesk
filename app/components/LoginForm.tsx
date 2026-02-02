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

type Tab = "ADMIN" | "COMPANY" | "EMPLOYEE" | null;

export default function LoginForm() {
  const search = useSearchParams();
  const [tab, setTab] = useState<Tab>(null);

  // shared personal number
  const [personalNumber, setPersonalNumber] = useState("");

  // company org no
  const [organizationNo, setOrganizationNo] = useState("");

  // shared 4-digit PIN (USER / COMPANY / EMPLOYEE)
  const [pinDigits, setPinDigits] = useState(["", "", "", ""]);
  const pinRefs = Array.from({ length: 4 }, () =>
    useRef<HTMLInputElement>(null),
  );
  const pinValue = pinDigits.join("");

  // reset PIN when switching tabs
  useEffect(() => {
    setPinDigits(["", "", "", ""]);
  }, [tab]);

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

  const PinInput = (
    <>
      <div className="flex gap-2 justify-center mt-1">
        {pinDigits.map((d, i) => (
          <Input
            key={i}
            ref={pinRefs[i]}
            value={d}
            maxLength={1}
            onChange={(e) => handlePinChange(i, e.target.value)}
            className="w-12 h-12 text-center bg-white text-black rounded-xs border-teal-300"
          />
        ))}
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[#00687a]">
      <div
        className="
    w-full max-w-md p-16 shadow-md rounded-3xl
    bg-[url('/img1.png')] bg-cover bg-center bg-no-repeat
  "
      >
        <h1 className="text-3xl font-extrabold uppercase mb-6 pb-6 text-center text-gray-100">
          arbets-desk
        </h1>

        {/* TABS */}
        <div className="flex mb-6 rounded-full overflow-hidden mt-10">
          {(["ADMIN", "COMPANY", "EMPLOYEE"] as Exclude<Tab, null>[]).map(
            (t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`flex-1 py-2 text-sm font-bold transition
        ${
          tab === t
            ? "bg-[#00687a] text-gray-100 text-xs"
            : "bg-teal-400 text-teal-100 hover:bg-teal-700 text-xs"
        }`}
              >
                {t}
              </button>
            ),
          )}
        </div>
        {!tab && (
          <p className="text-center text-[#00687a] text-sm">
            Please select a role.
          </p>
        )}

        {/* ================= USER LOGIN ================= */}
        {tab === "ADMIN" && (
          <form action={loginUserAction} className="grid gap-6">
            <div>
              <Label className="text-[#00687a] mb-2">Personal Number</Label>
              <Input
                name="personalNumber"
                value={personalNumber}
                onChange={(e) => setPersonalNumber(e.target.value)}
                className="bg-white text-black text-center h-12 rounded-xs border-teal-300"
                placeholder="YYYYMMDDXXXX"
              />
            </div>

            <div className="">
              <Label className="text-[#00687a]">PIN</Label>
              {PinInput}
              <input type="hidden" name="pinNumber" value={pinValue} />
            </div>

            <Button className="bg-[#00687a] border h-12 rounded-full ">
              Login <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>
        )}

        {/* ================= COMPANY LOGIN ================= */}
        {tab === "COMPANY" && (
          <form action={loginCompanyAction} className="grid gap-6">
            <div>
              <Label className="text-[#00687a] mb-2">Organization Number</Label>
              <Input
                name="organizationNo"
                value={organizationNo}
                onChange={(e) => setOrganizationNo(e.target.value)}
                className="bg-white text-black text-center h-12 rounded-xs border-teal-300"
                placeholder=""
              />
            </div>

            <div>
              <Label className="text-white">PIN</Label>
              {PinInput}
              <input type="hidden" name="loginCode" value={pinValue} />
            </div>

            <HomeLoginButton />
          </form>
        )}

        {/* ================= EMPLOYEE LOGIN ================= */}
        {tab === "EMPLOYEE" && (
          <form action={loginEmployeeAction} className="grid gap-6">
            <div>
              <Label className="text-white mb-2">Personal Number</Label>
              <Input
                name="personalNumber"
                value={personalNumber}
                onChange={(e) => setPersonalNumber(e.target.value)}
                className="bg-white text-black text-center h-12 border border-teal-300 rounded-xs"
                placeholder="YYYYMMDDXXXX"
              />
            </div>

            <div>
              <Label className="text-white">PIN</Label>
              {PinInput}
              <Input type="hidden" name="pinCode" value={pinValue} />
            </div>

            <HomeLoginButton />
          </form>
        )}
        <div className="w-full max-w-md p-2 mt-8 text-sm text-teal-800 text-center">
          If you are have problem with login, Contact us
        </div>
      </div>
    </div>
  );
}
