import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full rounded-xs bg-teal-400 text-teal-900 hover:bg-teal-500 cursor-pointer">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Registering...
        </>
      ) : (
        "Register User"
      )}
    </Button>
  );
}