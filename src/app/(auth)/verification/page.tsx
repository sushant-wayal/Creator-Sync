import { Footer } from "@/Components/MyComponents/General/Footer";
import { VerificationForm } from "@/Components/MyComponents/Forms/VerificationForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { PublicNavbar } from "@/Components/MyComponents/General/PublicNavbar";

const verificationPage = () => {
  return (
    <div className="w-lvw h-lvh flex flex-col justify-between items-center">
      <PublicNavbar/>
      <Card className="h-auto mx-auto bg-white border-2 text-black border-gray-600">
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