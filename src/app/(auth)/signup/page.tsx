import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card";
import Link from "next/link";
import { SignupForm } from "@/Components/MyComponents/Forms/SignupForm";
import { websiteName } from "@/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Signup | ${websiteName}`,
};

const singupPage = () => {
  return (
    <Card className="h-auto mx-auto bg-white border-2 text-black border-gray-600">
      <CardHeader>
        <CardTitle className="text-4xl">Sign Up</CardTitle>
        <CardDescription className="text-sm">Create an account to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <SignupForm/>
      </CardContent>
      <CardFooter className="flex justify-center items-center">
        <p className="text-center text-sm italic">
          Already have an account? <Link href="/signin" className="not-italic underline">Sign In</Link>
        </p>
      </CardFooter>
    </Card>
  )
}

export default singupPage;