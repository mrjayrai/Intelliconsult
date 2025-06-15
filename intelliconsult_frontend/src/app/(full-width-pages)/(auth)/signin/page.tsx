import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "IntelliConsult",
  description: "This is intelliConsult Sign In page",
};

export default function SignIn() {
  return <SignInForm />;
}
