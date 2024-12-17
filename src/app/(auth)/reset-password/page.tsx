import { Footer } from "@/Components/MyComponents/General/Footer";
import { ResetPasswordForm } from "@/Components/MyComponents/Forms/ResetPasswordForm";
import { Navbar } from "@/Components/MyComponents/General/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";

const resetPasswordPage = () => {
  return (
    <div className="w-lvw h-lvh flex flex-col justify-between items-center">
      <Navbar
        links={[
          { name: "Home", url: "/" },
          { name: "About", url: "/about" },
          { name: "Contact", url: "/contact" },
        ]}
      />
      <Card className="h-auto mx-auto bg-white border-0 text-black">
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