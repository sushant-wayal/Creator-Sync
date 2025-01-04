"use client"

import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const HomeEmailInput = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const gotoSignup = (email : string) => {
    if (email) {
      if (!email.includes("@")) {
        toast.error("Invalid Email Address");
        return;
      }
      router.push(`/signup?email=${email}`);
    }
    else toast.error("Please enter your email to get started.");
  }
  return (
    <div className="w-1/4 flex justify-center items-center gap-4">
      <Input
        placeholder="Enter Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button
        onClick={() => gotoSignup(email)}
      >
        Get Started
      </Button>
    </div>
  )
}