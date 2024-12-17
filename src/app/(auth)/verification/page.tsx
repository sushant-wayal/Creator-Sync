import { Footer } from "@/Components/MyComponents/General/Footer";
import { VerificationForm } from "@/Components/MyComponents/Forms/VerificationForm";
import { Navbar } from "@/Components/MyComponents/General/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";

const verificationPage = () => {
  return (
    <div className="w-lvw h-lvh flex flex-col justify-between items-center">
      <Navbar
        links={[
          { name: "Home", url: "/" },
          { name: "About", url: "/about" },
          { name: "Contact", url: "/contact" },
          { name: "Sign In", url: "/signin" },
          { name: "Sign Up", url: "/signup" }
        ]}
      />
      <Card className="h-auto mx-auto bg-white border-0 text-black">
        <CardHeader>
          <CardTitle className="text-4xl">Email Verification</CardTitle>
          <CardDescription className="text-sm">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <VerificationForm />
        </CardContent>
      </Card>
      <Footer />
    </div>
  );
}

export default verificationPage;