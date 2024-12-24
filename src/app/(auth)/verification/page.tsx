import { VerificationForm } from "@/Components/MyComponents/Forms/VerificationForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { websiteName } from "@/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Verify Email | ${websiteName}`,
};

const verificationPage = () => {
  return (
    <Card className="h-auto mx-auto bg-white border-2 text-black border-gray-600">
      <CardHeader>
        <CardTitle className="text-4xl">Email Verification</CardTitle>
        <CardDescription className="text-sm">Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <VerificationForm />
      </CardContent>
    </Card>
  );
}

export default verificationPage;