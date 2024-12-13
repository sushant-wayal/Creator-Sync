"use client";

import { Button } from "@/Components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { EmailFormSchema, LoginFormSchema } from "@/zodSchemas";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  FORGOT_PASSWORD_EMAIL,
  // PASSWORD_NOT_SET
} from "@/constants";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/Components/ui/dialog";
import { sendEmail } from "@/helper/mailer";

export const SignInForm = () => {
  const router = useRouter();
  const [showing, setShowing] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues:  {
      usernameOrEmail: "",
      password: ""
    }
  });
  const onSubmit = async(values: z.infer<typeof LoginFormSchema>) => {
    if (isDialogOpen) return;
    const toastId = toast.loading("Logging In...")
    try {
      const { usernameOrEmail, password } = values;
      const result = await signIn("credentials", {
        redirect: false,
        usernameOrEmail,
        password,
        newUser: false
      });
      if (result?.error) throw new Error(result.error);
      toast.success("Logged In Successfully", { id: toastId });
      router.push("/dashboard");
    } catch (error : any) {
      // if (error.response?.data?.message === PASSWORD_NOT_SET) toast.info("Password Not Set. Check Email to set Password", { id: toastId });
      // else toast.error(`Error Logging In : ${error.response.data.message || "Try Again"}`, { id: toastId })
      toast.error(`Error Logging In. Try Again`, { id: toastId })
    }
  }
  const forgotPasswordform = useForm<z.infer<typeof EmailFormSchema>>({
    resolver: zodResolver(EmailFormSchema),
    defaultValues:  {
      email: ""
    }
  });
  const onForgotPasswordSubmit = async(values: z.infer<typeof EmailFormSchema>) => {
    const toastId = toast.loading("Sending Reset Link...")
    try {
      const { email } = values;
      await sendEmail(email, FORGOT_PASSWORD_EMAIL);
      toast.success("Reset Link Sent", { id: toastId });
    } catch (error : any) {
      toast.error(`Error Sending Reset Link : ${error.response.data.message || "Try Again"}`, { id: toastId })
    }
  }
  const authSignin = async(provider: string) => {
    const toastId = toast.loading(`Signing In with ${provider}...`)
    try {
      const result = await signIn(provider, {
        redirect: false,
        callbackUrl: "/dashboard"
      });
      if (result?.error) throw new Error(result.error);
      toast.success(`Signed In with ${provider}`, { id: toastId });
    } catch (error : any) {
      // toast.error(`Error Signing In with ${provider} : ${error.response.data.message || "Try Again"}`, { id: toastId })
      toast.error(`Error Signing In with ${provider} Try Again`, { id: toastId })
    }
  }
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2 justify-start"
        >
          <FormField
            control={form.control}
            name="usernameOrEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Username or Email
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Username or Email"
                    {...field}
                    className="placeholder:text-[#444444] w-full"
                  />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Password
                </FormLabel>
                <FormControl>
                  <div className="flex items-center justify-between gap-2">
                    <Input
                      type={showing ? "text" : "password"}
                      placeholder="Password"
                      {...field}
                      className="placeholder:text-[#444444] w-full"
                    />
                    <Button
                      onClick={() => {
                        setShowing((prev: boolean) => !prev);
                      }}
                      type="button"
                      className="p-2"
                    >
                      {showing ?
                        <EyeOff/>
                        :
                        <Eye/>
                      }
                    </Button>
                  </div>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <Dialog>
            <DialogTrigger onClick={() => setIsDialogOpen(true)}>
              <p className="text-blue-500 cursor-pointer underline italic text-left text-sm">Forgot Password?</p>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Forgot Password?</DialogTitle>
                <DialogDescription>
                  Enter your email to receive a password reset link
                </DialogDescription>
                <Form {...forgotPasswordform}>
                  <form
                    onSubmit={forgotPasswordform.handleSubmit(onForgotPasswordSubmit)}
                    className="space-y-2"
                  >
                    <FormField
                      control={forgotPasswordform.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter Your Email"
                              {...field}
                              className="placeholder:text-[#444444] w-full"
                            />
                          </FormControl>
                          <FormMessage/>
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      disabled={forgotPasswordform.formState.isSubmitting}
                      className="disabled:cursor-not-allowed relative left-1/2 -translate-x-1/2 rounded-full"
                    >
                      {forgotPasswordform.formState.isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin h-5 w-5" />
                          <span className="ml-2">Sending Reset Link...</span>
                        </>
                      ): (
                        "Send Reset Link"
                      )}
                    </Button>
                  </form>
                </Form>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-1/3 disabled:cursor-not-allowed relative left-1/2 -translate-x-1/2 rounded-full"
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                <span className="ml-2">Signing In...</span>
              </>
            ): (
              "Sign In"
            )}
          </Button>
        </form>
      </Form>
      <hr className="my-5 bg-black border-[1px]"/>
      <div className="flex justify-evenly items-center w-full">
        <button className="rounded-full" onClick={() => authSignin("google")}>
          <img src="../../../../authLogo/google.svg" alt="Google Logo" className="w-10 aspect-square rounded-full"/>
        </button>
        <button className="rounded-full" onClick={() => authSignin("twitter")}>
          <img src="../../../../authLogo/x.svg" alt="X Logo" className="w-10 aspect-square rounded-full"/>
        </button>
        <button className="rounded-full" onClick={() => authSignin("linkedin")}>
          <img src="../../../../authLogo/linkedin.svg" alt="LinkedIn Logo" className="w-10 aspect-square rounded-full"/>
        </button>
      </div>
    </>
  )
}