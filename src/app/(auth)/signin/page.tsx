"use client";

import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { LoginFormSchema } from "@/zodSchemas";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Footer } from "@/Components/MyComponents/Footer";

const singinPage = () => {
  const [showing, setShowing] = useState<boolean>(false);
  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues:  {
      usernameOrEmail: "",
      password: ""
    }
  });
  const onSubmit = async(values: z.infer<typeof LoginFormSchema>) => {
    const toastId = toast.loading("Logging In...")
    try {
      const { usernameOrEmail, password } = values;
      const result = await signIn("credentials", {
        redirect: false,
        usernameOrEmail,
        password
      });
      console.log("result", result);
      toast.success("Logged In Successfully", { id: toastId });
    } catch (error : any) {
      toast.error(`Error Logging In : ${error.response.data.message || "Try Again"}`, { id: toastId })
    }
  }
  return (
    <>
      <Card
        className="h-auto w-[300px] mx-auto scale-110 bg-[#333333] border-0 relative top-[50vh] transform -translate-y-1/2 text-white rounded-3xl"
      >
        <CardHeader>
          <CardTitle className="text-center text-4xl">Log In</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
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
          <hr className="my-5"/>
          <div className="flex justify-evenly items-center w-full">
            <button className="rounded-full" onClick={() => signIn("google")}>
              <img src="../../../../authLogo/google.svg" alt="Google Logo" className="w-10 aspect-square rounded-full"/>
            </button>
            <button className="rounded-full" onClick={() => signIn("twitter")}>
              <img src="../../../../authLogo/x.svg" alt="X Logo" className="w-10 aspect-square rounded-full"/>
            </button>
            <button className="rounded-full" onClick={() => signIn("linkedin")}>
              <img src="../../../../authLogo/linkedin.svg" alt="LinkedIn Logo" className="w-10 aspect-square rounded-full"/>
            </button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center items-center">
          <p className="text-center text-sm italic">
            Don't have an account? <Link href="/signup" className="text-white not-italic underline">Sign Up</Link>
          </p>
        </CardFooter>
      </Card>
      <Footer className="fixed bottom-0 left-0"/>
    </>    
  );
}

export default singinPage;