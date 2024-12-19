import { Footer } from "@/Components/MyComponents/General/Footer";
import { ResetPasswordForm } from "@/Components/MyComponents/Forms/ResetPasswordForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { PublicNavbar } from "@/Components/MyComponents/General/PublicNavbar";

const resetPasswordPage = () => {
  return (
    <div className="w-lvw h-lvh flex flex-col justify-between items-center">
      <PublicNavbar/>
      <Card className="h-auto mx-auto bg-white border-2 text-black border-gray-600">
        <CardHeader>
          <CardTitle className="text-4xl">
            Reset Password
          </CardTitle>
          <CardDescription className="text-sm">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm />
        </CardContent>
      </Card>
      <Footer />
    </div>
  );
}

export default resetPasswordPage;