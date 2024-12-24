import { ResetPasswordForm } from "@/Components/MyComponents/Forms/ResetPasswordForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { websiteName } from "@/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Reset Password | ${websiteName}`,
};

const resetPasswordPage = () => {
  return (
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
  );
}

export default resetPasswordPage;