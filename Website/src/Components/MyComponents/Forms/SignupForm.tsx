"use client";

import { Button } from "@/Components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import { CalendarIcon, Eye, EyeOff, Loader2 } from "lucide-react";
import { Calendar } from "@/Components/ui/calendar";
import { format } from "date-fns";
import { SignUpFormSchema } from "@/zodSchemas";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SingleImageUpload } from "../General/SingleImageUpload";

export const SignupForm = () => {
  const router = useRouter();
  const defaultEmail = useSearchParams().get("email");
  const [showing, setShowing] = useState<boolean>(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const form = useForm<z.infer<typeof SignUpFormSchema>>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues:  {
      name: "",
      username: "",
      email: defaultEmail || "",
      dob: new Date(),
      password: ""
    }
  });
  const onSubmit = async(values: z.infer<typeof SignUpFormSchema>) => {
    const toastId = toast.loading("Signing Up...");
    let uploadedProfilePicture = profilePicture;
    try {
      const { 
        name,
        username,
        email,
        dob,
        gender,
        password
       } = values;
      const result = await signIn("credentials", {
        redirect: false,
        usernameOrEmail : username,
        name,
        username,
        email,
        dob,
        gender,
        password,
        profilePicture: uploadedProfilePicture,
        newUser: true
      });
      if (result?.error) {
        throw new Error(result.error);
      }
      router.push(`/profile/${username}/edit`);
      toast.success("Signed Up Successfully", { id: toastId });
    } catch (error : any) {
      // toast.error(`Error Signing Up : ${error.response.data.message || "Try Again"}`, { id: toastId })
      toast.error(`Error Signing Up. Try Again`, { id: toastId })
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <SingleImageUpload setUrl={setProfilePicture} buttonText="Upload Profile Picture"/>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Name"
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
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Username
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Username"
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Email"
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
                      type={showing ? "text" : "password"}
                      placeholder="Password"
                      {...field}
                      className="placeholder:text-[#444444]"
                    />
                    <Button
                      className="p-2"
                      onClick={() => {
                        setShowing((prev: boolean) => !prev);
                      }}
                      type="button"
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
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Date of Birth
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={"w-full bg-white placeholder:text-[#444444] rounded-full text-black font-normal"}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Gender
                </FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger className="bg-white placeholder:text-[#444444] rounded-full text-black">
                      <SelectValue placeholder="Gender"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="disabled:cursor-not-allowed bg-[#222222] relative left-1/2 -translate-x-1/2 rounded-full"
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="animate-spin h-5 w-5" />
              <span className="ml-2">Signing Up...</span>
            </>
          ): (
            "Sign Up"
          )}
        </Button>
      </form>
    </Form>
  )
};