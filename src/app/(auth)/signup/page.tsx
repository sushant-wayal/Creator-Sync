"use client";

import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { SignUpFormSchema } from "@/zodSchemas";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/Components/ui/calendar";
import { format } from "date-fns";
import { Footer } from "@/Components/MyComponents/Footer";

const singupPage = () => {
  const [showing, setShowing] = useState<boolean>(false);
  const form = useForm<z.infer<typeof SignUpFormSchema>>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues:  {
      name: "",
      username: "",
      email: "",
      dob: new Date(),
      password: ""
    }
  });
  const onSubmit = async(values: z.infer<typeof SignUpFormSchema>) => {
    const toastId = toast.loading("Signing Up...")
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
        usernameOrEmail : username,
        name,
        username,
        email,
        dob,
        gender,
        password
      });
      console.log("result", result);
      toast.success("Signed Up Successfully", { id: toastId });
    } catch (error : any) {
      toast.error(`Error Signing Up : ${error.response.data.message || "Try Again"}`, { id: toastId })
    }
  }
  return (
    <div className="relative top-[20vh]">
      <Card
        className="h-auto w-[300px] mx-auto mb-20 scale-110 bg-[#333333] border-0 text-white rounded-3xl"
      >
        <CardHeader>
          <CardTitle className="text-center text-4xl">Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
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
                        className="bg-white placeholder:text-[#444444] rounded-full text-black"
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
                        className="bg-white placeholder:text-[#444444] rounded-full text-black"
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
                        className="bg-white placeholder:text-[#444444] rounded-full text-black"
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
                          className="bg-white placeholder:text-[#444444] rounded-full text-black"
                        />
                        <Button className="w-16 rounded-full" onClick={() => {
                          setShowing((prev: boolean) => !prev);
                        }} type="button">
                          {showing ?
                            <img src="../../../../hidden.png" alt="Hide Password" className="w-6 aspect-square"/>
                            :
                            <img src="../../../../eye.png" alt="Show Password" className="w-6 aspect-square"/>
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
                      >
                        <SelectTrigger
                          className="bg-white placeholder:text-[#444444] rounded-full text-black"
                        >
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
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="disabled:cursor-not-allowed bg-[#222222] relative left-1/2 -translate-x-1/2 rounded-full"
              >
                {form.formState.isSubmitting ? (
                  <>
                    Logging In...
                  </>
                ): (
                  "Log In"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center items-center">
          <p className="text-center text-sm italic">
            Already have an account? <Link href="/signin" className="text-white not-italic underline">Sign In</Link>
          </p>
        </CardFooter>
      </Card>
      <Footer/>
    </div>    
  );
}

export default singupPage;