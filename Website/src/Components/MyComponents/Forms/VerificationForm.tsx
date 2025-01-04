"use client"

import { verifyEmail } from "@/actions/authentication";
import { Button } from "@/Components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { EmailFormSchema } from "@/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Loader2 } from "lucide-react";
import { notFound, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const VerificationForm = () => {
  const [verified, setVerified] = useState(false);
  const token = useSearchParams().get("token");
  if (!token) notFound();
  const form = useForm<z.infer<typeof EmailFormSchema>>({
    resolver: zodResolver(EmailFormSchema),
    defaultValues:  {
      email: ""
    }
  });
  const onSubmit = async(values: z.infer<typeof EmailFormSchema>) => {
    const toastId = toast.loading("Verifying Email...");
    try {
      const { email } = values;
      const result = await verifyEmail(email, token || "");
      if (typeof result === 'object' && result.error) {
        throw new Error(result.error);
      }
      toast.success("Email Verified", { id: toastId });
      setVerified(true);
    } catch (error : any) {
      toast.error(error ? `${error}` : `Error Verifying Email. Try Again`, { id: toastId });
    }
  }
  return (
    verified ?
      <div className="flex justify-start items-center gap-4">
        <CheckCircle className="text-green-500" />
        <p className="text-center">Your Email is now Verified</p>
      </div>
      :
      <FormProvider {...form}>
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
                    {...field}
                    placeholder="Enter Your Email"
                    className="placeholder:text-[#444444]"
                  />
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
                <span className="ml-2">Verifying Email...</span>
              </>
            ): (
              "Verify Email"
            )}
          </Button>
        </form>
      </FormProvider>
    )
};