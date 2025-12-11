"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createUserAction } from "../actions";
import React from "react";
import SubmitButton from "./SubmitButton";

const initialState = { success: false, message: "" };

export default function UserRegistrationForm() {
  const [state, formAction] = React.useActionState(
    createUserAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-4 max-w-md mx-auto">
      {state.message && (
        <p className={state.success ? "text-green-600" : "text-red-600"}>
          {state.message}
        </p>
      )}

      <div>
        <Label>Name</Label>
        <Input name="name" required />
      </div>

      <div>
        <Label>Email</Label>
        <Input name="email" type="email" required />
      </div>

      <div>
        <Label>Phone Number</Label>
        <Input name="phoneNumber" required />
      </div>

      <div>
        <Label>Swedish Personal Number</Label>
        <Input name="personalNumber" required />
      </div>

      <div>
        <Label>Address</Label>
        <Input name="address" required />
      </div>

      <SubmitButton />
    </form>
  );
}
