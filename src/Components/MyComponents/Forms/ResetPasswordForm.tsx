"use client";

import { Button } from "@/Components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { ResetPasswordFormSchema } from "@/zodSchemas";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/actions/authentication";

export const ResetPasswordForm = () => {
  const router = useRouter();
  const token = useSearchParams().get("token");
  if (!token) notFound();
  const [showingPassword, setShowingPassword] = useState<boolean>(false);
  const [showingConfirmPassword, setShowingConfirmPassword] = useState<boolean>(false);
  const form = useForm<z.infer<typeof ResetPasswordFormSchema>>({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues:  {
      email: "",
      password: "",
      confirmPassword: ""
    }
  });
  const onSubmit = async(values: z.infer<typeof ResetPasswordFormSchema>) => {
    const toastId = toast.loading("Resetting Password...")
    try {
      const { email, password } = values;
      const result = await resetPassword(email, password, token);
      if (typeof result === 'object' && result.error) {
        throw new Error(result.error);
      }
      toast.success("Password Reset Successfully", { id: toastId });
      router.push("/signin");
    } catch (error : any) {
      toast.error(error ? `${error}` : `Error Resetting Password. : Try Again`, { id: toastId })
    }
  }
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    {...field}
                    className="placeholder:text-[#444444]"
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
                      type={showingPassword ? "text" : "password"}
                      placeholder="Password"
                      {...field}
                      className="placeholder:text-[#444444]"
                    />
                    <Button
                      onClick={() => {
                        setShowingPassword((prev: boolean) => !prev);
                      }}
                      type="button"
                      className="p-2"
                    >
                      {showingPassword ?
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
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <div className="flex items-center justify-between gap-2">
                    <Input
                      type={showingConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      {...field}
                      className="placeholder:text-[#444444]"
                    />
                    <Button
                      onClick={() => {
                        setShowingConfirmPassword((prev: boolean) => !prev);
                      }}
                      type="button"
                      className="p-2"
                    >
                      {showingConfirmPassword ?
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
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="disabled:cursor-not-allowed relative left-1/2 -translate-x-1/2 rounded-full"
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                <span className="ml-2">
                  Resetting Password...
                </span>
              </>
            ): (
              "Reset Password"
            )}
          </Button>
        </form>
      </Form>
    </>
  )
}