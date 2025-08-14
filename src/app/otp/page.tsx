
import { OtpForm } from "@/components/otp-form";

export default function OtpPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <OtpForm />
      </div>
    </div>
  );
}
