import { Footer } from "@/Components/MyComponents/General/Footer";
import { SignInForm } from "@/Components/MyComponents/Forms/SigninForm";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card";
import Link from "next/link";
import { PublicNavbar } from "@/Components/MyComponents/General/PublicNavbar";

const singinPage = () => {
  return (
    <div className="w-lvw h-lvh flex flex-col justify-between items-center">
      <PublicNavbar/>
      <Card className="h-auto mx-auto bg-white border-2 text-black border-gray-600">
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
      <Footer />
    </div>    
  );
}

export default singinPage;