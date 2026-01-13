import { SignUpForm } from "@/components/auth/signup-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Sign up for Finance Tracker",
};

export default function SignUpPage() {
  return <SignUpForm />;
}
