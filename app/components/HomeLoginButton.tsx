"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

export function HomeLoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="bg-teal-900 flex items-center justify-center gap-2"
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Logging in...
        </>
      ) : (
        <>
          Login <ArrowRight className="ml-2 w-4 h-4" />
        </>
      )}
    </Button>
  );
}
