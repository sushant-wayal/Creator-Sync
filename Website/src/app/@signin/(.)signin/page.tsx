import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card";
import { Signin } from "./signin";
import { SignInForm } from "@/Components/MyComponents/Forms/SigninForm";
import Link from "next/link";

const signinIntercept = () => {
  return (
    <Signin>
      <Card className="h-auto mx-auto bg-white border-0 text-black">
        <CardHeader>
          <CardTitle className="text-4xl">Welcom Back!</CardTitle>
          <CardDescription className="text-sm">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <SignInForm/>
        </CardContent>
        <CardFooter className="flex justify-center items-center">
          <p className="text-center text-sm italic">
            Don't have an account? <Link href="/signup" className="not-italic underline">Sign Up</Link>
          </p>
        </CardFooter>
      </Card>
    </Signin>
  )
};

export default signinIntercept;