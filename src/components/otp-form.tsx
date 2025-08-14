"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
})

export function OtpForm() {
  const { toast } = useToast()
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
    // Here you would typically verify the OTP with your backend
    // For now, we'll just show a success toast and redirect.
    toast({
      title: "Authentication Successful",
      description: "You have been successfully logged in.",
    });
    router.push("/");
  }

  return (
    <div className="w-full p-6 sm:p-8 space-y-4 bg-card rounded-xl shadow-lg">
        <div className="text-center">
            <h1 className="text-2xl font-bold font-headline">Enter authentication code</h1>
            <p className="text-sm text-muted-foreground mt-2">
                Enter the 6-digit code from your authentication app.
            </p>
        </div>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 text-center">
            <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                <FormControl>
                    <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                    </InputOTP>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <Button type="submit" className="w-full text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90">Verify</Button>
        </form>
        </Form>
    </div>
  )
}
